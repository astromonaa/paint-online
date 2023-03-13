import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/:id' element={<App/>}></Route>
      <Route path={'/'} element={<Navigate to={`f${(+new Date).toString(16)}`} />} />
    </Routes>
  </BrowserRouter>
)
