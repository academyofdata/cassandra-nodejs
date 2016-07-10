const cassandra = require('cassandra-driver');
const async = require('async');
module.exports = function(app,cli){

    const select = "SELECT * FROM data.users "
    const where = " WHERE uid=?"
    const insert = "INSERT INTO data.users(uid,gender,ocupation,age,zip) values (?,?,?,?,?)"
    const update = "UPDATE data.users SET %s WHERE uid=?"

    //get all users
    //for execute fetchSize is not specified, defaults to 5000
    app.get('/users5000',function(req,res){
        cli.execute(select,{prepare:true},function(err,result){
            if(err) {
                res.json({"error":102,"message":JSON.stringify(err)})
            } else {
                res.json({"error":0,"message":"ok","result":result.rows})
            }
        })
    })

    app.get('/users',function(req,res){
        
        var pageState;
        var ndone = 0;
        qres = []
        async.doWhilst(
            function (next) {
                cli.eachRow(select, [], { prepare : true , pageState: pageState, fetchSize : 500 }, function (n, row) {
                    //output the row
                    //res.write(JSON.stringify(row));
                    qres.push(row)
                    ndone++
                }, function (err, result) {
                    console.log("done batch ",ndone)
                    if(ndone >= 10000){//do not send more than aprox 10k recs
                        pageState = null //force termination
                    } else {
                        // Store the paging state
                        pageState = result.pageState
                        
                    }
                    next()
                });
            },
            function condition() {
                return !!pageState;
            },
            function ended(err) {
            //TODO: check err
                console.log("done records ",ndone)
                if(err) {
                    res.json({"error":104,"message":JSON.stringify(err)})
                } else {
                    res.json({"error":0,"message":"ok","resultSize":qres.length,"result":qres})
                }
            }
        )
  
    })
    

    //get specific user
    app.get('/users/:uid',function(req,res){
        cli.execute(select+where,[req.params.uid],function(err,result){
            if(err) {
                res.json({"error":100,"message":JSON.stringify(err)})
            } else {
                res.json({"error":0,"message":"ok","result":result.rows})
            }
        })
    })
    //adduser
    app.post('/users',function(req,res){
        data = new Array()
        if(req.body.uid == null) {
            data.push(cassandra.types.Uuid.random())
        } else {
            data.push(req.body.uid)
        }
        data.push(req.body.gender)
        data.push(req.body.ocupation)
        data.push(req.body.age)
        data.push(req.body.zip)
        // prepare is important here, allows the right type inferrence
        cli.execute(insert,data,{ traceQuery: true, prepare:true},function(err,result) {
            if(err) { 
                res.json({"error":101,"message":JSON.stringify(err),"result":data})
            } else {
                var traceId = result.info.traceId;
                cli.metadata.getTrace(traceId, function (er, trace) {
                    console.log('Trace for the execution of the query: "%s":',insert);
                    console.log(trace);
                    res.json({"error":0,"message":"ok","trace":trace,"result":data})
                })
            }
            

        })
    })
    //update user
    app.put('/users/:uid',function(req,res){

    })

} 