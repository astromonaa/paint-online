import Brush from "./Brush";

export default class Eraser extends Brush {
  constructor(canvas, socket, id) {
    super(canvas, socket, id)
    this.listen()
  }
  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'eraser',
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
          lineWidth: this.ctx.lineWidth
        }
      }))
    }
  }
  static draw(ctx, x, y, lineWidth) {
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = '#fff'
    ctx.lineTo(x, y)
    ctx.stroke()
  }
}