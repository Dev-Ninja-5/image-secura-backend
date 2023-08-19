const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/User.routes");
const { testsRouter } = require("./routes/Test.routes");
const { fileRouter } = require("./routes/File.routes");
const { authenticate } = require("./middlewares/authenticate.middleware");
const cors = require("cors");

require("dotenv").config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to Classroom App");
});

app.use("/users", userRouter);
//middleware
app.use(authenticate);
app.use("/tests", testsRouter);
app.use("/notes", fileRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to the DB");
  } catch (err) {
    console.log(err);
  }
  console.log(`listening at port : ${process.env.port}`);
});
