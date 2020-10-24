const http = require('http')
const fs = require('fs')

const io = require('socket.io')(3000)
  
http.createServer((req, res) => {
  const filePath = __dirname + (req.url === '/' ? '/index.html' : req.url)
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end(JSON.stringify(err))
      return
    }
    res.writeHead(200)
    res.end(data)
  })
}).listen(io)

io.on('connection', socket => {
	socket.on('new-user', name => {
		users[socket.id] = name
		socket.broadcast.emit('user-connected', name)
	})
	socket.on('send-chat-message', message => {
		socket.broadcast.emit('chat-message', { message: message, name:
		users[socket.id] })

	})
		socket.on('disconnect', () => {
			socket.broadcast.emit('user-disconnected', users[socket.id])
		delete users[socket.id]
		
	})
})
