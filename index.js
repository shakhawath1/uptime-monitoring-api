// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
// const environment = require('./helpers/environments');
// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// creat server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });
};

// handle request and response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
