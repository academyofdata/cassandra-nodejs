var express = require('express');
var app     = express();
var port    =   process.env.PORT || 8080;


const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['192.168.56.88'], queryOptions: { consistency: types.consistencies.quorum }  });
// ROUTES
// ==============================================

// sample route with a route the way we're used to seeing it
app.get('/about', function(req, res) {
    res.json({"message":"small express app"});  
});

var logFn = function (req, res, next) {
  console.log('LOG',req.method,req.originalUrl);
  next();
};

app.use(logFn);

// we'll create our routes here
require('./meta')(app,client);
// START THE SERVER
// ==============================================
client.connect(function(err){
    if(err){
        console.log("Error connecting",err)
        process.exit()
    } else {
        console.log("connected to cassandra")
    }
})
app.listen(port);
console.log('Started on port ' + port);
