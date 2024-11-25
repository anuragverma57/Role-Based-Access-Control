const router = require("express").Router();

router.get("/profile", (req, res, next) => {
  const person = {}
  res.render("profile",{person});
});

module.exports = router;
