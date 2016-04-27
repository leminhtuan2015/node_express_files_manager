var express = require('express');
var fs = require("fs");
var router = express.Router();
var config = require('../config');
var debug = require('debug')('server_express:server' + __dirname);
var Firebase = require('firebase');
var firebase = new Firebase(config.firebase.host);

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readdir(config.database, function(err, filesName){
    if (err){
      console.log(err);
      return err;
    }else{
      var filesData = [];
      filesName.forEach(function (fileName) {
        var stats = fs.statSync(config.database + fileName);
        var size = stats["size"]
        var ctime = stats["mtime"]
        var fileData = {name: fileName, size: size, ctime: ctime}
        filesData.push(fileData)
      });
      res.send(JSON.stringify(filesData));
    }
  });
});

router.get('/:fileName', function(req, res, next) {
  var fileName = req.params.fileName;
  console.log("fileName : " + fileName)
  res.download(config.database + fileName, fileName, function(error){
    if (error) {
      console.log("download fail")
    } else {
      console.log("download done")
    }
  });
});

router.post('/', function(req, res, next) {
  if (!req.files) {
		res.send(JSON.stringify({status: config.status.no_fole}));
		return;
	}
  var myFile = req.files.myFile;
  var fileName = req.files.myFile.name

	myFile.mv(config.database + fileName, function(err) {
		if (err) {
			res.send(JSON.stringify({status: config.status.ng}));
		}
		else {
      firebase.update({files: config.status.file_uploaded})
			res.send(JSON.stringify({status: config.status.ok}));
		}
	});
});

router.delete('/:fileName', function(req, res, next) {
  var fileName = req.params.fileName;
  console.log("fileName : " + fileName)

  fs.unlink(config.database + fileName, function(err){
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      res.send(JSON.stringify({status: config.status.ng}));
    }
    else {
      firebase.update({files: config.status.file_deleted})
      res.send(JSON.stringify({status: config.status.ok}));
    }
  });
});

module.exports = router;
