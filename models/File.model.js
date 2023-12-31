const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  name: {type:String,required:true},
  file: {type:String,required:true},
});

const FileModel = mongoose.model("file", fileSchema);

module.exports = {
  FileModel,
};
