const http = require("http")

const server = http.createServer((req, res) => {
    console.log(req.url)
    res.writeHead(200);
    res.end("hello world")
})

server.listen(3000, () => {
    console.log("Server listening on 3000")
})