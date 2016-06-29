module.exports = function(app,cli){

    app.get('/keyspace', function(req, res){
        console.log('get keyspaces')
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
    app.get('/table/:keyspace',function(req,res){
        console.log('get tables for',req.params.keyspace)
        res.send("ok")
    });
    //other routes..
}
