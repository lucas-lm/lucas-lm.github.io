(function () {

  // Generating random numbers

  function random(max=1, min=0) {
    return min + (max - min)*Math.random()
  }

  function randomInt(max=1, min=0) {
    return Math.round(random(max, min))
  }

  // Model for simple star

  class Star {
    constructor(x=0, y=0, radius=1, color='white', lifeSpan=10000) {
      this._x = x
      this._y = y
      this._radius = radius
      this._shine = 1.5*radius
      this._color = color
      this._lifeSpan = lifeSpan
      this._bornTime = Date.now()
    }

    get x() {
      return this._x
    }

    set x(x) {
      this._x = x
    }
    
    get y() {
      return this._y
    }

    set y(y) {
      this._y = y
    }

    get radius() {
      return this._radius
    }

    set radius(radius) {
      this._radius = radius
      this._shine = 1.3*radius
    }

    get shine() {
      return this._shine
    }

    get color() {
      return this._color
    }

    set color(color) {
      this._color = color
    }

    get lifeSpan() {
      return this._lifeSpan
    }

    set lifeSpan(lifeSpan) {
      this._lifeSpan = lifeSpan
    }

    get bornTime() {
      return this._bornTime
    }

    get age() {
      return Date.now() - this.bornTime
    }

    get isDead() {
      return this.age > this.lifeSpan
    }

    reborn() {
      this._bornTime = Date.now()
    }

  }

  // Method for draw the star
  Star.prototype.draw = function(context) {
    context.save()
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.strokeStyle = 'transparent'
    //context.shadowColor = this.color
    //context.shadowBlur = this.shine // It causes performance issues on chrome for android...
    context.fillStyle = this.color
    context.fill()
    context.stroke()
    context.restore()
  }

  // Function to keep the coerence of the canvas size
  function resizeCanvasToDisplaySize(canvas) {
    const { width, height } = canvas.getBoundingClientRect()
    
    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio:ratio=1 } = window
      const context = canvas.getContext('2d')
      canvas.width = width*ratio
      canvas.height = height*ratio
      context.scale(ratio, ratio)
      return true
    }

    return false
  }

  // Bootstrap the animation
  const init = () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    let index = 0

    //initial state
    const stars = []
    for (let i=0; i<50; i++) {
      const radius = random(1, 5)
      const star = new Star(0, 0, radius, 'white', 0)
      star.blue = randomInt(255) // Little hacky: this prop doesn't even exists on Star class...
      star.red = randomInt(255, 200) // Little hacky: this prop doesn't even exists on Star class...
      star.speedY = random(0.3)
      star.speedX = 0
      star.A = random(0.12)
      stars.push(star)
    }

    const render = () => {
      ctx.save()
      resizeCanvasToDisplaySize(canvas)
      const { width, height } = ctx.canvas
      ctx.clearRect(0, 0, width, height)
      // draw
      for (let star of stars) {
        const { age, lifeSpan } = star
        const fade = Math.max(0, 1 - age/lifeSpan)
        star.color = `rgba(${star.red}, ${Math.round(255*fade)}, ${star.blue}, ${fade})`
        star.speedX += star.A*random(0.2, -0.2)
        star.x += star.speedX
        star.y += star.speedY
        star.radius += 0.035
        if (star.isDead) {
          star.reborn()
          star.radius = random(1, 5)
          star.blue = randomInt(255) // Little hacky: this prop doesn't even exists on Star class...
          star.red = randomInt(255) // Little hacky: this prop doesn't even exists on Star class...
          star.speedY = random(0.3)
          star.speedX = 0
          star.A = random(0.12)
          star.lifeSpan = randomInt(2000, 7000)
          star.x = randomInt(star.radius, ctx.canvas.width-star.radius)
          star.y = randomInt(star.radius, ctx.canvas.height-star.radius)
        }
        star.draw(ctx)
      }
      // end draw
      index++
      ctx.restore()
      requestAnimationFrame(render)
    }
    render()
  }
  init()

})()
