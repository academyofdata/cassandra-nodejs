module.exports = function(app,cli){


    app.get('/data/:keyspace/:table', function(req, res){
        console.log('get data for',req.params.keyspace, req.params.table)
        if(req.params.keyspace != null && req.params.table != null) {
            var q = "select * from "+req.params.keyspace+"."+req.params.table
	        if( JSON.stringify(req.query) !== JSON.stringify({})) {
		        console.log(JSON.stringify(req.query))
                q += " WHERE "
	    	    for(k in req.query) {
			        q += k + "=" + req.query[k] + "" 
		        }
	        }
	        q += "  ;"
            console.log("executing",q)
            cli.execute(q,function(err,resp){
                if(err){
                    console.log(err)
                    res.json({"error":11,"message":JSON.stringify(err)})
                } else {
                    res.json({"error":0,"result":resp.rows})
                } 
            })
        } else {
            res.json({"error":10,"message":"no keyspace or table specified"})
        }
    })


}
