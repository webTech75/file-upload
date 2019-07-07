var express = require('express');
var app = express();
var multer = require('multer');
var cors = require('cors');

app.use(cors());

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

var upload = multer({
              storage: storage,
              fileFilter: function(req, file, cb) {
                if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                  return cb(new Error('Wrong extension type'));
                }
                cb(null, true);
              }
            }).single('file');

app.post('/upload', function(req, res) {

  upload(req, res, function(err) {
    if(err instanceof multer.MulterError || err) {
      return res.status(500).json(err);
    }else if(req.files === null) {
      return res.status(400).json({msg: 'No file uploaded'})
    }
    return res.status(200).send(req.file);
  })
})

app.listen(8000, function() {
  console.log('App running on port 8000');
})