const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const evalWithPy = require('./utils/translatePy')

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', client => {
    console.log('Connessione!')

    client.on('richiestaMM', () => {
        let msg = evalWithPy()
        client.emit('chessEval', msg)
    })

    client.on('disconnect', () => {
        console.log('Disonnessione!')
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log('Il server sta andando!'))