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
var mongoose = require("mongoose");
var http = require("http").Server(app);
var io = require("socket.io")(http);

var dbURL = "mongodb://user:user@ds129004.mlab.com:29004/node-test";
var Message = mongoose.model("Message",{
 "term": String,
 "defined": String
})
var skierTerms = [
    {
        term: "Cardiologist",
        defined: "a doctor who specializes in the study or treatment of heart diseases and heart abnormalities."
    },
    {
        term: "Ophthalmologist",
        defined: "a specialist in the branch of medicine concerned with the study and treatment of disorders and diseases of the eye"
    },
    {
        term: "Dietician",
        defined: "an expert on diet and nutrition"
    },
    {
        term: "Immunologist",
        defined: "an expert of structure and function of the immune system"
    }
    
];



app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}'`);
	next();
});

app.use(express.static("./public"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cors());

app.get("/dictionary-api", function(req, res) {
    Message.find({}, function(err, skierTerms){
        res.json(skierTerms);
    })
	//res.json(skierTerms);
});

app.post("/dictionary-api", function(req,res){
    var message = new Message(req.body);
    message.save(function(err){
        if(err)
        sendStatus(500);
        // skierTerms.push(req.body);
        // res.json(skierTerms);
        Message.find({}, function(err, skierTerms){
            io.emit("message", skierTerms);
        })
       // io.emit("message", req.body);

    })
    
})

app.delete("/dictionary-api/:term", function(req, res){
    // skierTerms=skierTerms.filter(function(item){
    //     return (item.term.toLowerCase() != req.params.term.toLowerCase() );
    // })
    // res.json(skierTerms);
    Message.remove({term:req.params.term}, function(err){
        console.log("error removing document");
        Message.find({}, function(err, skierTerms){
             res.json(skierTerms);
        })
    })

})

mongoose.connect(dbURL,  function(err){
    console.log("mongo db connection", err);
})
const port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log('myapp listening on port ' + port);
});

/* app.listen(3000);

console.log("Express app running on port 3000"); */

module.exports = app;