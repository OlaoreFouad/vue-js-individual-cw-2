const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// mongodb imports
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Allow-Access-Control-Origin", "*");
  next();
});

app.use((req, res, next) => {
  MongoClient.connect(
    "mongodb+srv://fouad:foodiepassword@cluster0.ev0uv.mongodb.net/eSchool"
  )
    .then((client) => {
      req.lessonsCollection = client.db().collection("lessons");
      req.ordersCollection = client.db().collection("orders");
      console.log("Connected to database successfully!");
      next();
    })
    .catch((err) => {
      console.log("Error occurred while connecting to db!");
    });
});

app.use((req, res, next) => {
  console.log("Incoming request to: " + req.url);
  next();
});

app.get("/lessons", (req, res, next) => {
  req.lessonsCollection
    .find()
    .toArray()
    .then((lessons) => {
      res.send(lessons);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/lessons", async (req, res, next) => {
  const lessons = req.body.lessons;
  let updatedCount = 0;
  await lessons.forEach((lesson) => {
    req.lessonsCollection
      .findOne({
        _id: new ObjectID(lesson.id),
      })
      .then((existingLesson) => {
        existingLesson.spaces -= lesson.spaces;
        return existingLesson;
      })
      .then((existingLesson) => {
        return req.lessonsCollection.updateOne(
          {
            _id: new ObjectID(lesson.id),
          },
          {
            $set: {
              spaces: existingLesson.spaces,
            },
          },
          (err, res) => {
            if (err) console.error(err);
          }
        );
      })
      .then((updated) => {
        updatedCount++;
        if (updatedCount == lessons.length) {
          res.send({
            message: `${ updatedCount } lessons updated successfully!`,
            status: true,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

app.get("/orders", (req, res, next) => {
  req.ordersCollection
    .find()
    .toArray()
    .then((orders) => {
      res.send(orders);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/orders", (req, res, next) => {
  const newOrder = req.body;
  req.ordersCollection
    .insertOne(newOrder)
    .then((_) => {
      res.status(200).send({
        status: true,
        message: "Order submitted successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        status: false,
        message: "Unable to submit order",
      });
    });
});

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
  });
});

app.use((req, res, next) => {
  res.status(404).send("File Not Found!");
});

app.listen(3000, (_) => {
  console.log("Server started!");
});
