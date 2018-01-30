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
var hdb = require("hdb");

var dbURL = "mongodb://user:user@ds129004.mlab.com:29004/node-test";
var Message = mongoose.model("Message",{
 "term": String,
 "defined": String
})
/* var skierTerms = [
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
    
]; */


var client = hdb.createClient({
  host         : '10.253.93.93', // system database host
  port         : 30041,      // system database port
       // name of a particular tenant database
  user         : 'SBSS_13988520589903605775014444066546162537552001080972040348833164815',     // user for the tenant database
  password     : 'Aj3hnx_vJd6viSvWfXGq7A_FHgFYwiR8OY6r71v7ash1dqkWtx.bpLMy3PL3Tke0P5OePgz0VxsulTcx452npN5O9eI.Mu5sO0in942PSUfkWGaZtj.Typ4RDPi5ypWb'    // password for the user specified
});

app.use(function(req, res, next) {
    console.log(`${req.method} request for '${req.url}'`);    
	next();
});


app.use(express.static("./public"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cors());



app.get("/dictionary-api", function(req, res) {
    /* Message.find({}, function(err, skierTerms){
        res.json(skierTerms);
    }) */

    client.on('error', function (err) {
        console.log("Network connection error");
        console.error('Network connection error', err);
      });
      client.connect(function (err) {
        if (err) {
            console.log("Error connecting hana db");
            return console.error('Connect error', err);
        }
        client.exec('select * from DUMMY', function (err, rows) {
          client.end();
          if (err) {
            console.log("Error fetching table record");
            return console.error('Execute error:', err);
          }      
          console.log('Results:', rows);
          res.json(rows);
        });
      });


	//res.json(skierTerms);
});

app.post("/dictionary-api", function(req,res){
    var message = new Message(req.body);
    message.save(function(err){
        if(err)
        sendStatus(500);
        // skierTerms.push(req.body);
        // res.json(skierTerms);
        io.emit("message", req.body);

    })
    
})

app.delete("/dictionary-api/:term", function(req, res){
    skierTerms=skierTerms.filter(function(item){
        return (item.term.toLowerCase() != req.params.term.toLowerCase() );
    })
    res.json(skierTerms);

})

/* client.on('error', function (err) {
    console.log("Network connection error");
    console.error('Network connection error', err);
  });
  client.connect(function (err) {
    if (err) {
        console.log("Error connecting hana db");
        return console.error('Connect error', err);
    }
    client.exec('select * from DUMMY', function (err, rows) {
      client.end();
      if (err) {
        console.log("Error fetching table record");
        return console.error('Execute error:', err);
      }
      console.log('Results:', rows);
    });
  }); */

// mongoose.connect(dbURL,  function(err){
//     console.log("mongo db connection", err);
// })
const port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log('myapp listening on port ' + port);
});



/* app.listen(3000);

console.log("Express app running on port 3000"); */

module.exports = app;