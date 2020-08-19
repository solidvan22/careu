var MongoClient = require('mongodb').MongoClient;
let mongodbServer = "application:Chacha123@mongodb://35.231.29.183:27017"
let databaseName = "careu-db"
var dbInstance;
console.log('mongodbServer' , mongodbServer); 
function connect(){
    return new Promise((resolve,reject)=>{
        MongoClient.connect(mongodbServer+ databaseName,function (err, client){
                if(err) {
                    console.log("Error al intentar conectar a la BD: " + err);
                    reject(err);
                }
                else{ 
                    console.log("Conectado correctamente a la BD " + databaseName + "\n");
                    //collectionCampaigns = db.collection('campanas');
                    dbInstance = client.db(databaseName)
                    resolve(dbInstance);
                }
        });
    } )
}
async function getDb(){
    if(dbInstance){
        console.log('dbInstance already exists')
        
    }else{
        console.log('dbInstance undefined , conecting to database')
        dbInstance =await connect();
    }
    return dbInstance;
    
}
module.exports={connect,getDb}