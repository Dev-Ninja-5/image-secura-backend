const express = require("express");
const multer = require("multer");

const { FileModel } = require("../models/File.model");
const fileRouter = express.Router();

//storage
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("testImage");

fileRouter.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newImage = new FileModel({
        name: req.body.name,
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      newImage
        .save()
        .then(() => res.send("Successfully uploaded"))
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

module.exports = {
  fileRouter,
};
