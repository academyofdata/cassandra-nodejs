var oc = require('../ocupations.json')
var config = require('./config.json')
var request = require( 'supertest' )
var querystring = require('querystring')
var gen = ["M","F"]

var getRand = function(min,max) {
  return Math.floor(Math.random() * (1+max-min)) + min
}

describe('API REST',function(){
    it('get users',function(done){
        request(config.baseUrl)
        .get("users")
        .expect(200)
        .expect("Content-Type","application/json; charset=utf-8")
        .expect(function(res){
            res.body.should.have.property('result')
            //console.log(res.body.result)
            res.body.result.should.be.instanceof(Array)
            console.log(res.body.result.length + " users existing in the database")
            res.body.result.forEach(function(t){
                request(config.baseUrl)
                .get('/users/'+t.uid)
                .expect(200)
                .expect("Content-Type","application/json; charset=utf-8")
            })
        })
        .end(function(e,r){
            done(e)
        })
    })

    var x = 10000
    
    
    for(i=0;i<x;i++){

        
        
        it('adds new user', function(done){
            var obj = new Object
            obj.age = getRand(18,65)
            obj.ocupation = oc[getRand(0,oc.length-1)]
            obj.gender = gen[getRand(0,gen.length-1)]
            obj.zip = ""+getRand(10000,99999)

            request(config.baseUrl)
            .post("users")
            .send(obj)
            .expect(200)
            .expect("Content-Type","application/json; charset=utf-8")
            .expect(function(res){
                console.log(res.body)
            })
            .end(function(e,r){
                done(e)  
            })

        })
    }
})

