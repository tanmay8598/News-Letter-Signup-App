//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req, res){
  // res.write("<h1>Hola!</h1>");
  res.sendFile(__dirname + "/signup.html");
  // console.log("Hey");
});

app.post("/",function(req, res){
  const firstName = req.body.fName;
  const lastName  = req.body.lName;
  const email = req.body.email;

  var data ={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/13528a4bd5";

  const options = {
    method: "POST",
    auth: "tanmay:c838ecc34dc741fa38d54a28b45c38e0-us7"
  };

  const request = https.request(url, options, function(response) {
    if(response.statusCode ===200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function(){
  console.log("Server Started at port 3000");
});

//
// API Key
// c838ecc34dc741fa38d54a28b45c38e0-us7
//
// List id
// 13528a4bd5
