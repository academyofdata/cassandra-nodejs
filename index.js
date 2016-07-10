var express = require('express')
var bodyParser = require('body-parser')
var app     = express();
var port    =   process.env.PORT || 8080;

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['192.168.56.88'], queryOptions: { consistency: cassandra.types.consistencies.one }  });
// ROUTES
// ==============================================

// sample route with a route the way we're used to seeing it
app.get('/about', function(req, res) {
    res.json({"message":"small express app"}) 
});

var logFn = function (req, res, next) {
  console.log('LOG',req.method,req.originalUrl)
  //console.log("ROUTES",JSON.stringify(app._router.stack))
  next();
};

app.use(logFn);
app.use(bodyParser.json())
// we'll create our routes here
require('./meta')(app,client)
require('./data')(app,client)
require('./user')(app,client)
// START THE SERVER
// ==============================================
client.connect(function(err){
    if(err){
        console.log("Error connecting",err)
        process.exit()
    } else {
        console.log("connected to cassandra "+ new Date().getTime())
    }
})
app.listen(port);
console.log('Started on port ' + port + " at " + new Date().getTime());
