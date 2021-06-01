const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// mongodb imports
const MongoClient = require("mongodb").MongoClient;

const app = express();

app.use((req, res, next) => {
    MongoClient.connect(
        "mongodb+srv://fouad:foodiepassword@cluster0.ev0uv.mongodb.net/eSchool"
    ).then(client => {
        req.lessonsCollection = client.db().collection("lessons");
        req.ordersCollection = client.db().collection("orders");
        console.log('Connected to database successfully!');
        next()
    }).catch(err => {
        console.log('Error occurred while connecting to db!');
    })
})

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
