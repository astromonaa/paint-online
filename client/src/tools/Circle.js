import Tool from "./Tool";

export default class Rect extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id)
    this.listen()
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
  }


  mouseDownHandler(e) {
    this.mouseDown = true
    this.ctx.beginPath()
    this.startX = e.pageX - e.target.offsetLeft;
    this.startY = e.pageY - e.target.offsetTop;
    this.saved = this.canvas.toDataURL()
  }
  mouseUpHandler(e) {
    this.mouseDown = false;
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'circle',
        x: this.startX,
        y: this.startY,
        radius: this.radius,
        color: this.ctx.fillStyle,
        lineWidth:this.ctx.lineWidth,
        strokeColor: this.ctx.strokeStyle
      }
    }))
  }
  mouseMoveHandler(e) {
    if (this.mouseDown) {
      const currentX = e.pageX - e.target.offsetLeft;
      const currentY = e.pageY - e.target.offsetTop;
      const width = currentX - this.startX;
      const height = currentY - this.startY;

      this.radius = Math.sqrt(width ** 2 + height ** 2)

      this.draw(this.startX, this.startY, this.radius)
    }
  }
  draw(x, y, radius) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath()
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
      this.ctx.fill();
      this.ctx.stroke()
    }
  }
  static staticDraw(ctx, x, y, radius, color, lineWidth, strokeColor) {
    ctx.lineWidth = lineWidth
    ctx.fillStyle = color;
    ctx.strokeStyle = strokeColor
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill();
    ctx.stroke()
  }
}