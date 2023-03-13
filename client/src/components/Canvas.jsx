import { observer } from 'mobx-react-lite';
import '../styles/canvas.scss'
import canvasState from '../store/canvasState';
import toolsState from '../store/toolsState';
import Brush from '../tools/Brush';
import { useRef, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Rect from '../tools/Rect';
import Circle from '../tools/Circle'
import axios from 'axios'
import Line from '../tools/Line';
import Eraser from '../tools/Eraser';

const Canvas = observer(() => {

  const canvasRef = useRef()
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)

  const params = useParams()

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    const ctx = canvasRef.current.getContext('2d')
    axios.get(`http://localhost:5000/api/image?id=${params.id}`)
      .then(res => {
        const img = new Image();
        img.src = res.data;
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
          ctx.stroke()
        }
      })
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket('ws://localhost:5000/')
      canvasState.setSocket(socket)
      canvasState.setSessionId(params.id)
      toolsState.setTool(new Brush(canvasRef.current, socket, params.id))
      socket.onopen = () => {
        console.log('Connected');
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: 'connection'
        }))
      }
      socket.onmessage = event => {
        const message = JSON.parse(event.data)
        switch (message.method) {
          case "connection":
            console.log(`User ${message.username} connected`);
            break

          case "draw":
            drawHandler(message)
            break
        }
      }
    }
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const { figure } = msg
    const ctx = canvasRef.current.getContext('2d')

    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
        break
      case "rect":
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.lineWidth, figure.strokeColor)
        break
      case "circle":
        Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.color, figure.lineWidth, figure.strokeColor)
        break
      case "line":
        Line.staticDraw(ctx, figure.x, figure.y, figure.startX, figure.startY, figure.color, figure.lineWidth)
        break
      case "eraser":
        Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
        break
      case "canvas":
        const image = new Image()
        image.src = figure.img;
        image.onload = () => {
          ctx.clearRect(0, 0, canvasRef.
            current.width, canvasRef.current.height)
          ctx.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height)
        }
      case "finish":
        ctx.beginPath()
        break
    }
  }

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
    axios.post(`http://localhost:5000/api/image?id=${params.id}`, { img: canvasRef.current.toDataURL() })
      .then(res => console.log(res))
  }

  const connectHandler = () => {
    if (usernameRef.current.value.trim().length) {
      canvasState.setUsername(usernameRef.current.value)
      setModal(false)
    }
  }

  return (
    <div className='canvas'>
      <Modal show={modal} onHide={() => { }}>
        <Modal.Header closeButton>
          <Modal.Title>Your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input ref={usernameRef} type="text" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={connectHandler}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas onMouseDown={mouseDownHandler} ref={canvasRef} width={800} height={600}></canvas>
    </div>
  );
});

export default Canvas;