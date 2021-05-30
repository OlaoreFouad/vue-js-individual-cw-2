const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();

app.use((req, res, next) => {
    console.log('Incoming request to: ' + req.url);
    next();
})

app.use((req, res, next) => {
    var imagePath = path.join(__dirname, "static", req.url);
    fs.stat(imagePath, (err, file) => {
        if (err) {
            next();
            return;
        } else if (file.isFile()) {
            res.sendFile(imagePath);
        } else {
            next();
        }
    })
})

app.use((req, res, next) => {
    res.status(404).send("File Not Found!");
})

app.listen(3000, (_) => {
    console.log('Server started!');
})
