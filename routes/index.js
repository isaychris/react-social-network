var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/p/:id', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/u/:username', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
