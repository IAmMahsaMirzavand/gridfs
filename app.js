var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var imgSchema = require("./model")
var fs = require("fs")
var path = require("path")
const multer = require("multer")
app.set("view engine", "ejs")
require("dotenv").config()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now())
  },
})

var upload = multer({ storage: storage })

app.get("/", async (_, res) => {
  try {
    const imgs = await imgSchema.find()
    console.log(imgs)
    res.render("imagepage", { items: imgs })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

app.post("/", upload.single("image"), async (req, res) => {
  console.log(req.file)

  try {
    const obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    }
    await imgSchema.create(obj)
    res.redirect("/")
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

var port = process.env.PORT || "3000"
mongoose
  .connect(
    "mongodb+srv://mahsacb74:ZkE5LPrl0bQ1DhBW@cluster0.5phbe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, (err) => {
      if (err) throw err
      console.log("Server listening on port", port)
    })
  })
