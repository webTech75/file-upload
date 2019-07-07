var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

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

/** API path that will upload the files */
app.post('/upload', function(req, res) {
  var exceltojson;
  upload(req, res, function(err) {
    if(err instanceof multer.MulterError) {
      return res.status(500).json(err);
    }else if(err) {
      return res.status(500).json(err)
    }
    //return res.status(200).send(req.file);
    /** Check the extension of the incoming file and
     *  use the appropriate module
     */
    if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
      exceltojson = xlsxtojson;
    } else {
      exceltojson = xlstojson;
    }
    try {
        exceltojson({
            input: req.file.path,
            output: null, //since we don't need output.json
            lowerCaseHeaders:true
        }, function(err,result){
            if(err) {
                return res.json({error_code:1,err_desc:err, data: null});
            }
            res.json({error_code:0 ,err_desc:null, data: result});
        });
    } catch (err){
        res.json({error_code:1 ,err_desc:"Corupted excel file"});
    }
  })
})

app.listen(8000, function() {
  console.log('App running on port 8000');
})