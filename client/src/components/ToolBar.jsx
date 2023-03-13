import React from 'react';
import '../styles/toolbar.scss'
import toolsState from '../store/toolsState';
import Brush from '../tools/Brush';
import canvasState from '../store/canvasState';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';

const ToolBar = () => {

  const changeColor = (color) => {
    toolsState.setFillColor(color)
    toolsState.setStrokeColor(color)
  }
  const download = () => {
    const dataUrl = canvasState.canvas.toDataURL()
    console.log(dataUrl);
    const a = document.createElement('a')
    a.href = dataUrl;
    a.download = canvasState.sessionId + '.jpg';
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  return (
    <div className='toolbar'>
      <button className='toolbar__btn brush' onClick={() => toolsState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
      <button className='toolbar__btn rect' onClick={() => toolsState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
      <button className='toolbar__btn circle' onClick={() => toolsState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
      <button className='toolbar__btn eraser' onClick={() => toolsState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
      <button className='toolbar__btn line' onClick={() => toolsState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}></button>
      <input style={{marginLeft: 10}} type="color" onChange={e => changeColor(e.target.value)}/>
      <button className='toolbar__btn undo' onClick={() => canvasState.undo()}></button>
      <button className='toolbar__btn redo' onClick={() => canvasState.redo()}></button>
      <button className='toolbar__btn save' onClick={download}></button>
    </div>
  );
};

export default ToolBar;