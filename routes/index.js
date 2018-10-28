var express = require('express');
var router = express.Router();

router.get('/api/test', function(req, res, next) {
  res.json({success: true});
});

module.exports = router;
