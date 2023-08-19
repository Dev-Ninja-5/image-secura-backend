const express = require("express");
const { TestModel } = require("../models/Test.model");
const { noteData } = require("../controllers/Note.controller");
const multer = require("multer");

const testsRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// G E T   R E Q U E S T
testsRouter.get("/alltests", async (req, res) => {
  console.log("inside get req");
  try {
    const tests = await TestModel.find();
    //console.log(tests);
    res.status(200).send(tests);
  } catch (err) {
    console.log(err);
  }
});

//S I N G L E   T E S T
testsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const test = await TestModel.findOne({ _id: id });
    console.log(test);
    res.status(200).send(test);
  } catch (err) {
    console.log(err);
  }
});
// P O S T
testsRouter.post("/create", async (req, res) => {
  const payload = req.body;

  try {
    const new_Test = new TestModel(payload);
    await new_Test.save();
    res.send({ msg: "Testroom Created" });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something Went Wrong" });
  }
});

// P A T C H
testsRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const test = await TestModel.find({ _id: id });
  const userID_in_test = test[0].userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userID_in_test) {
      res.send({ msg: "You Are Not Authorised" });
    } else {
      await NoteModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("updated the Test");
    }
  } catch (err) {
    res.send({ msg: "Something Went Wrong" });
  }
});

//P A T C H //  A D D I N G   F I L E S  TO  D B

testsRouter.patch("/:id/addnote", upload.single("file"), async (req, res) => {
  let id = req.params.id;

  let { name, description, excelFile } = req.body;
  console.log("name", name, "desc", description);
  console.log("reqFile", req.file);
  if (req.file) {
    const newFile = {
      name,
      description,
      excelFile,
      file: req.file.buffer.toString("base64"),
    };
    console.log("newFile", newFile);

    try {
      const note = await TestModel.findById(id);
      console.log("note is =>", newFile);
      if (note) {
        note.notes.push(newFile); // push the newFile object into the notes array
        await note.save(); // save the note
        let findAllNotes = await TestModel.findOne({ _id: id });
        res.send({ msg: "added file" });
        console.log("note-added");
      } else {
        res.send("Class Not Found");
      }
    } catch (err) {
      res.send(err);
    }
  } else {
    console.log(req.body);
  }
});

//D E L E T E
testsRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await TestModel.findByIdAndDelete({ _id: id });
    res.send("Deleted the Test");
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something Went Wrong" });
  }
});

module.exports = {
  testsRouter,
};
