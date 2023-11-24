var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
  
 
  res.send("Hoc vien");
});

module.exports = router;
