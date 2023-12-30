const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  name: {type:String,required:true},
  file: {type:String,required:true},
});

const FileModel = mongoose.model("test", fileSchema);

module.exports = {
  FileModel,
};
