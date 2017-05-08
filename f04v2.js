


var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var MongoClient=require("mongodb").MongoClient;
var app = express();

var mdbURL="mongodb://bearuirei2:us33ak7x@ds137360.mlab.com:37360/sos161701";
var publicFolder=path.join(__dirname,'public/');


var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v2";

var db;
var db2;
var dba;

var APIgvg=require("./api/gvg.js");
var APIstartups=require("./api/startups-stats.js");
var APIyouthunemploymentstats=require("./api/youthunemploymentstats.js");
var apikey="sos161701";


var ApikeyFunction = function(request, response) {
    if (!request.query.apikey) {
        console.error('WARNING: apikey is empty!');
        response.sendStatus(401);
        return false;
    }
    if (request.query.apikey !== apikey) {
        console.error('WARNING: Invalid apikey!');
        response.sendStatus(403);
        return false;
    }
    return true;
};

MongoClient.connect(mdbURL,{native_parser:true},function(err,database){
    
    if(err){
        console.log(err);
        process.exit("CONECTION DB FAILED"+err);
    }
       db= database.collection("gvg");
       db2 = database.collection("startups-stats");
       dba = database.collection("youthunemploymentstats");
       
       APIgvg.initial(app, db, BASE_API_PATH, ApikeyFunction);
       APIstartups.initial(app,db2,BASE_API_PATH,ApikeyFunction);
       APIyouthunemploymentstats.initial(app,dba,BASE_API_PATH,ApikeyFunction);

       app.listen(port,()=>{
           console.log("Magic is happening on port " + port);
       });

    
});




app.use("/",express.static(path.join('public')));
app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

app.get(BASE_API_PATH+"/test",function(request, response) {
    response.sendfile(publicFolder+"botones.html");
});
app.get(BASE_API_PATH+"/RestClientGvg", function(request, response){
    response.sendFile(publicFolder + "GVG/indexbea.html");
});
app.get(BASE_API_PATH+"/RestClientYUS", function(request, response){
    response.sendfile(publicFolder + "indexalb.html");
});
app.get(BASE_API_PATH+"/RestClientSS", function(request, response){
    response.sendFile(publicFolder + "indexirene.html");
});
app.get(BASE_API_PATH+"/chartBea", function(request, response){
    response.sendFile(publicFolder + "GVG/chart.html");
});
app.get("/analytics", (req, res) => {
    var from = 2000;
    var to = 2017;
    var serie = [];
  
    
    for(var year=from; year<=to; year++){
        serie.push({
            country:res.data.country,
            year: year,
            income_million:res.data.income_million,
            income_ratio:res.data.income_ratio
        });
    }

    res.send(serie);
});
