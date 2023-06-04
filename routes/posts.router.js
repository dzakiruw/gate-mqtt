const express = require("express")
const router = express.Router()

const postsController = require("../controller/posts.controller")

router.post("/keluar", postsController.keluar)
router.post("/masuk", postsController.masuk)
// router.get("/test",postsController.test)

module.exports = router