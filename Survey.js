

/* const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myapp listening on port ' + port);
}); */

var express = require("express");
var bodyparser = require("body-parser");
var cors = require("cors");
var app = express();
var mongoclient = require("mongodb").MongoClient;
var http = require("http").Server(app);
var io = require("socket.io")(http);
var JSONStream = require('JSONStream')
var mongoose = require("mongoose");
//var dbconnection = require("./database/dbconnection");

var dbURL = "mongodb://user:user@ds129004.mlab.com:29004/node-test";
var Message = mongoose.model("words",{
 "term": String,
 "defined": String
})

var url = 'mongodb://i6nJW6sBiCW_JUNB:P4rHD1uMszzclQDe@10.11.241.38:35019/hFm7cmJPddFNUeii';
//var url = "mongodb://localhost:27017/surveydb";
//var db = dbconnection.connect(url);

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}'`);
	next();
});

app.use(express.static("./public"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cors());


app.get("/dictionary-api", function(req, res) {
   /*  Message.find({}, function(err, words){
        res.json(words);
    }) */
    
    mongoclient.connect(url, function(err,database){
        if(err){
        res.json(err + "Hi");       
        }
        else{
            try{
        //const mydb = database.db('emdSY6_oZCUyPKhg');
        var coll = {};
        var jsoncol = "";
        const mydb = database.db('hFm7cmJPddFNUeii');
        console.log("came for get");
         mydb.collection('documents').find({}).toArray(function(err, items){
             console.log(items);
             res.json(items);
        })   
        console.log("Connected successfully to server");
            }   
            catch(ex){
                res.json(ex + "Hello");
            throw ex;
            }
        }
       // db.close();
    });
	//res.json(skierTerms);
});

app.post("/dictionary-api", function(req,res){
    /* var message = new Message(req.body);
    message.save(function(err){
        if(err)
        sendStatus(500);
        // skierTerms.push(req.body);
        // res.json(skierTerms);
        Message.find({}, function(err, words){
            io.emit("message", words);
        })
       // io.emit("message", req.body);

    }) */
    console.log("came topost method");
    try{
    mongoclient.connect(url, function(err,database){
       // var mydb = database.db('emdSY6_oZCUyPKhg');
       if(err)
       console.log(err + "hi");
        var mydb = database.db('hFm7cmJPddFNUeii');
        mydb.collection("documents").insertOne(req.body, function(err, result){
        if(err)
        console.log("error in insertion");
        else
        console.log("connected");
        // var cursor = mydb.collection('documents').find();      
        // io.emit("message", cursor);
    })
})
    }
    catch(ex){
    console.log(ex + "Hello");
    }
    
})

app.delete("/dictionary-api/:term", function(req, res){
    // skierTerms=skierTerms.filter(function(item){
    //     return (item.term.toLowerCase() != req.params.term.toLowerCase() );
    // })
    // res.json(skierTerms);

   /*  Message.remove({"_id" : "5a5892b17b358300be1b433b"}, function(err){
        console.log("error removing document");
        Message.find({}, function(err, words){
             res.json(words);
        })
    }) */
    
    Message.remove({term:req.params.term}, function(err){
        console.log("error removing document");
        Message.find({}, function(err, words){
             res.json(words);
        })
    })

})

/* mongoose.connect(url,  function(err){
    console.log("mongo db connection", err);
}) */
const port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log('myapp listening on port ' + port);
});

/* app.listen(3000);

console.log("Express app running on port 3000"); */

module.exports = app;