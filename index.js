const express = require("express")
const app = express()

require('dotenv').config()
require('./controller/mqttController');


app.use(express.urlencoded({extended: false}))
app.use(express.json())

const postsRouter = require('./routes/posts.router')

app.use("/", postsRouter)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log("Server is running....")
})