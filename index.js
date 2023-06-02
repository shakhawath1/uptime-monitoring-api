const http = require('http');

// app object - module scaffolding
const app = {};

// cinfiguration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });
};
// handle req res
app.handleReqRes = (req, res) => {
    res.end('hi');
};

// sart the server
app.createServer();
