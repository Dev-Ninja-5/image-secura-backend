const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

const FileModel = mongoose.model("File", fileSchema);

module.exports = {
  FileModel,
};
