const express = require('express'),
      router = express.Router();
      middleware = require('../middleware');

router.get("/add",middleware.isLoggedIn,function(req,res){
    res.render("add");
});

module.exports = router;