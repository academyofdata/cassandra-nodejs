module.exports = function(app,cli){

    app.get('/meta/keyspace', function(req, res){
        //we could've used client.metadata.keyspaces
        console.log('get keyspaces')
        //depends on the version, in <3 was system.schema_keyspaces
        var q = "select * from system_schema.keyspaces"
        cli.execute(q,function(err,resp){
            if(err){
                console.log(resp)
                res.json({"error":1,"message":JSON.stringify(resp)})
            } else {
                res.json({"error":0,"result":resp.rows})
            }
        })
        
    });
    
    app.get('/meta/table/:keyspace',function(req,res){
        console.log('get tables for',req.params.keyspace)
        if(req.params.keyspace != null) {
            var q = "select * from system_schema.tables where keyspace_name='"+req.params.keyspace+"'"
            console.log("executing",q)
            cli.execute(q,function(err,resp){
                if(err){
                    console.log(resp)
                    res.json({"error":3,"message":JSON.stringify(resp)})
                } else {
                    res.json({"error":0,"result":resp.rows})
                } 
            })
        } else {
            res.json({"error":2,"message":"no keyspace specified"})
        }
    });
    //other routes..
}
