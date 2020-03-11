(function() {
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
    constructor(text="", speed=500) {
      super()
      this.text = text
      this.isTyping = false
      this.isDeleting = false
      this.speed = speed
    }
  }

  Object.defineProperty(Writer.prototype, "isWaiting", {
    get: function () {
      return !(this.isDeleting || this.isTyping)
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
      setTimeout(() => this.typeText(rest), this.speed)
    } else {
      this.isTyping = false
    }
    this.notifyAll()
  }

  Writer.prototype.deleteText = function() {
    if (this.text !== "" ) {
      this.isDeleting = true
      this.deleteLetter()
      setTimeout(this.deleteText.bind(this), this.speed)
    } else {
      this.isDeleting = false
    }
    this.notifyAll()
  }

  const span = document.getElementById('type')
  const text = span.innerText

  
  const writer = new Writer(text, 200)
  const observer = new Observer(writer)
  let index = 0
  const texts = ["web apps", "Pancakes", "whatever you want"]

  function updateSpan() {
    if (writer.isWaiting && writer.text !== "" && index !== texts.length) writer.deleteText()
    if (writer.isWaiting && writer.text === "") {
      writer.typeText(texts[index])
      index++
    }
    if (index === 3 && writer.isWaiting) {
      span.setAttribute('contenteditable', true)
    }
    span.innerText = writer.text
  }

  writer.deleteText()

  observer.notify = updateSpan.bind(observer)

  
})()

// Yes, I am aware of the overengineering applied here
