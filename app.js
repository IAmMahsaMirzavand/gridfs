var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var imgSchema = require('./model');
var fs = require('fs');
var path = require('path');
const multer = require('multer');
app.set("view engine", "ejs");
require('dotenv').config();


mongoose.connect('mongodb+srv://mahsacb74:ZkE5LPrl0bQ1DhBW@cluster0.5phbe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'); 
    
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.get('/', (req, res) => {
    imgSchema.find({})
    .then((data, err)=>{
        if(err){
            console.log(err);
        }
        res.render('imagepage',{items: data})
    })
});


app.post('/', upload.single('image'), (req, res, next) => {
    console.log(req.file) 
    
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
          

        }
       
    }
    imgSchema.create(obj)
    .then ((err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});

var port = process.env.PORT || '3000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})
