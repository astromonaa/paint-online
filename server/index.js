const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const router = require('./router/index')

app.use(cors())
app.use(express.json())
app.use('/api', router)

const port = process.env.PORT || 5000;

app.ws('/', (ws, req) => {
  console.log('connected');
  ws.on('message', msg => {
    msg = JSON.parse(msg)
    switch(msg.method) {
      case "connection":
        connectionHandler(ws, msg)
        break;
      case "draw":
        broadcastConnection(ws, msg)
    }
  })
})

app.listen(port, () => console.log(`Server started on ${port} port`))

function connectionHandler(ws, msg) {
  ws.id = msg.id;
  broadcastConnection(ws, msg)
}

function broadcastConnection(ws, msg) {
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg))
    }
  })
}