
const http = require("http");
const express = require("express");
const app = require("./app");

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

server.listen(PORT, '0.0.0.0' ,error => {

    if (error) {
        return console.log(error);
    }

    console.log("🚀 Server started on port " + PORT);

});
