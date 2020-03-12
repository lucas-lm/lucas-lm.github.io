(function() {

  // modeling objects

  function Observable() {
    this.observers = []
  }

  Observable.prototype.notifyAll = function() {
    for (let observer of this.observers) {
      observer.notify()
    }
  }

  function Observer(observable) {
    this.observable = observable
    this.subscribe()
    this.notify = this.notify.bind(this)
  }

  Observer.prototype.subscribe = function() {
    this.observable.observers.push(this)
  }

  Observer.prototype.unsubscribe = function() {
    this.observable.observers.pull(this)
  }

  Observer.prototype.notify = function() {}

  class Writer extends Observable {
    constructor(text="", speed=3) {
      super()
      this.text = text
      this.isTyping = false
      this.isDeleting = false
      this.speed = speed // Speed of typing and deleting in letter/seconds
    }
  }

  Object.defineProperty(Writer.prototype, "isWaiting", {
    get: function () {
      return !(this.isDeleting || this.isTyping)
    }
  })

  Object.defineProperty(Writer.prototype, "timeout", {
    get: function() {
      return 1000/this.speed
    }
  })

  Object.defineProperty(Writer.prototype, "randomTimeout", {
    get: function() {
      const randomSpeed = (Math.random()-0.5)*this.speed // Can add or subtract 50% of the speed
      return 1000/(this.speed + randomSpeed)
    }
  })

  Writer.prototype.deleteLetter = function() {
    const { text="" } = this
    if (text.length > 0 ) this.text = text.slice(0, text.length-1)
    else this.text = ""
  }

  Writer.prototype.typeLetter = function(letter) {
    this.text += letter
  }

  Writer.prototype.typeText = function(text) {
    if (text !== "") {
      this.isTyping = true
      this.typeLetter(text[0])
      const rest = text.slice(1)
      setTimeout(() => this.typeText(rest), this.randomTimeout)
    } else {
      this.isTyping = false
    }
    this.notifyAll()
  }

  Writer.prototype.deleteText = function() {
    if (this.text !== "" ) {
      this.isDeleting = true
      this.deleteLetter()
      setTimeout(this.deleteText.bind(this), this.randomTimeout)
    } else {
      this.isDeleting = false
    }
    this.notifyAll()
  }

  // real code

  const span = document.getElementById('type')
  const text = span.innerText
  let { texts='[]', speed=5, interval=2 } = span.dataset
  texts = JSON.parse(texts)
  speed = Number(speed)
  interval = Number(interval)
  
  const writer = new Writer(text, speed)
  const observer = new Observer(writer)
  
  const classes = ['blue', 'red', 'purple-gradient','typing-last', 'type-in']
  let index = 0

  function updateSpan() {
    if (writer.isWaiting && writer.text !== "" && index !== texts.length) 
    setTimeout(() => writer.deleteText(), interval*1000) // delay before start deleting
    if (writer.isWaiting && writer.text === "") {
      writer.typeText(texts[index])
      span.className = 'typing ' + classes[index]
      index++
    }
    if (index === texts.length && writer.isWaiting) {
      span.className = 'type-in'
      span.setAttribute('contenteditable', true)
    }
    span.innerText = writer.text
  }

  observer.notify = updateSpan.bind(observer)
  setTimeout(() => writer.deleteText(), 2500) // delay before start the effect

})()

// Yes, I am aware of the overengineering applied here
