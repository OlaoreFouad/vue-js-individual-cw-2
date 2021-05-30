const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// static file middleware
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000)
