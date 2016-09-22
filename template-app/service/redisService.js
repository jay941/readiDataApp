

/**
 * Service for Retriving Data from redisServer
 * 
 */
var Promise = require("bluebird");
var redis = Promise.promisifyAll(require("redis"));
var client = redis.createClient();

angular.module('myApp')
    .service('redisService', function ($q) {
        var a1 = [];
        var d = 0;
       
        
        var dataA = {}; 
       this.scan = function (cursor, cb) {
            var i = 0;
            var final = [];
            client.scanAsync(cursor).then(function (list) {
              list[1].forEach(function(name){
                      console.log('scan')
                    client.typeAsync(name).then(function(type){
                       console.log('data push')
                        final.push({ key: name, value: type });
                      // console.log('cb in Service',final)
                            // console.log('cb in Service',name,type)

                            i++;
                            if(i==list[1].length){
                                     cb(list,final);
                            }
                           
                      })
                    
                })
            
            
                // console.log('reolsving list ', list);
                // cb(list,type);
            });
        }
      
        this.getData = function (selected) {
            var i = 0;
            var finalData = [];
            var SetData = [];
            return $q(function (resolve, reject) {
                //Retriving  data type of particular key one by one from redis server
                client.typeAsync(selected).then(function (dataType) {

                    switch (dataType) {
                        case 'hash':
                            //Retriving hash Key from redisService
                            client.hkeysAsync(selected).then(function (k) {
                                k.forEach(function (kData) {
                                    //Retriving  all hash value from redisServer
                                    client.hgetAsync(selected, kData).then(function (data) {
                                        finalData.push({ type:dataType,key: kData, value: data });
                                        i++;
                                        if (i == k.length) {
                                            console.log(finalData)
                                            resolve(finalData);

                                        }
                                    })//end of hgetAsync
                                })//end of forEach

                            })//end of hkeysAsync
                            break;
                        case 'set':
                            //Retriving  all set value from redisServer
                            client.smembersAsync(selected).then(function (s) {
                                console.log(s);
                                s.forEach(function (s1) {
                                    SetData.push({ type:dataType,key: selected, value: s1 })
                                })
                                console.log(SetData)
                                resolve(SetData);
                            })
                            break;
                        case 'list':
                            //Retriving  list hash value from redisServer
                            client.lrangeAsync(selected, 0, -1).then(function (ml) {
                                ml.forEach(function (ml1) {
                                    SetData.push({ type:dataType, key: selected, value: ml1 })
                                })
                                resolve(SetData);
                            })
                            break;
                        case 'string':
                            //Retriving  all string value from redisServer
                            client.mgetAsync(selected).then(function (str) {
                                str.forEach(function (str1) {
                                    SetData.push({ type:dataType, key: selected, value: str1 })
                                })
                                resolve(SetData);
                            })
                            break;
                    }
                })
            })//end of return
        }//end of getData

        //addData-For seting data to redisServer
        this.addData = function (name, dname, dkey, dvalue) {
            return $q(function (resolve, reject) {
            if(dname == ''|| dkey==''){
                alert('Invalid Syntax');

            }
            else{

            
                switch (name) {
                    case 'hash': 
                        client.hset(dname, dkey, dvalue, redis.print);
                        var su = " Hash data added SuccessFully";
                        resolve(su);
                        break;
                    case 'string':
                        client.set(dname, dkey, redis.print);
                        var su = " String data is SuccessFully";
                        resolve(su);
                        break;
                    case 'set':
                        client.sadd(dname, dkey, redis.print);
                        var su = " set data is added SuccessFully";
                        resolve(su);
                        break;
                    case 'list':
                        client.lpush(dname, dkey, redis.print);
                        var su = " List data is added SuccessFully";
                        resolve(su);
                        break;
                    default: alert("Wrong Input");
                        break;

                }//end of switch

            }//end of else

            })//end of $q
        }//end of addData


        this.removeData = function (name, dname, dkey) {
            return $q(function (resolve, reject) {
                  if(dname == ''|| dkey==''){
                alert('Invalid Syntax');

            }else{

            
                switch (name) {
                    case 'hash':
                        client.hdel(dname, dkey, redis.print);
                        var su = " Hash data is deleted SuccessFully";
                        resolve(su);
                        break;
                    case 'list':
                        client.lpop(dname, redis.print);
                        var su = " List data is deleted SuccessFully";
                        resolve(su);
                        break;
                    case 'set':
                        client.srem(dname, dkey, redis.print);
                        var su = " Set data is deleted SuccessFully";
                        resolve(su);
                        break;
                    case 'string':
                        client.del(dname, redis.print);
                        var su = " String data is deleted SuccessFully";
                        resolve(su);
                        break;

                    default: alert("Wrong Input");
                        break;
                }
            }
            })//end of $q
        }//end of removeData
    }); //end os Service