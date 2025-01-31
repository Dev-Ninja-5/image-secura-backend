const express = require("express");
const { FileModel } = require("../models/File.model");

const multer = require("multer");

const fileRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// G E T   R E Q U E S T
fileRouter.get("/files/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const files = await FileModel.find({ uploadedBy: userId });
    res.status(200).json(files);
  } catch (error) {
    console.error("Error while fetching files:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//S I N G L E   T E S T
fileRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const file = await FileModel.findOne({ _id: id });
    console.log(file);
    res.status(200).send(file);
  } catch (err) {
    console.log(err);
  }
});
// P O S T
fileRouter.post("/create", async (req, res) => {
  const payload = req.body;

  try {
    const new_file = new FileModel(payload);
    await new_file.save();
    res.send({ msg: "fileroom Created" });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something Went Wrong" });
  }
});

// P A T C H
fileRouter.patch("/upload/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const file = await FileModel.find({ _id: id });
  const userID_in_file = file[0].userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userID_in_file) {
      res.send({ msg: "You Are Not Authorised" });
    } else {
      await NoteModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("updated the file");
    }
  } catch (err) {
    res.send({ msg: "Something Went Wrong" });
  }
});

//P A T C H //  A D D I N G   F I L E S  TO  D B

fileRouter.post("/upload", upload.single("file"), async (req, res) => {
  let { name } = req.body;
  const { userId } = req.user;

  if (req.file) {
    const newFile = {
      name,
      file: req.file.buffer.toString("base64"),
      uploadedBy: userId,
    };
    console.log("newFile", newFile);
    try {
      const new_file = new FileModel(newFile);
      await new_file.save();
      res.send({ msg: "file Uploaded" });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  } else {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

//D E L E T E
fileRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await FileModel.findByIdAndDelete({ _id: id });
    res.send("Deleted the file");
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something Went Wrong" });
  }
});

module.exports = {
  fileRouter,
};
