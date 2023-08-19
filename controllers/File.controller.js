const File = require("../models/File.model");

const uploadFile = (req, res, next) => {
  const file = new File({
    fileName: req.file.originalname,
    contentType: req.file.mimetype,
    data: req.file.buffer,
  });

  file.save((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "File Uploaded Successfully" });
  });
};

module.exports = {
  uploadFile,
};
