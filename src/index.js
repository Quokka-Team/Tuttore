'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');


/*
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
*/


//Connectando a la base de datos y luego iniciando el servidor
mongoose.connect(config.db,(err, res)=>{
    if(err) throw err;
    console.log('Conexion con MongoDB establecida');

    app.listen(config.port, ()=>{
        console.log(`API REST corriendo en el puerto ${config.port}`);
    });

});


































/*

//Corriendo con mongoose
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const uri_cluster_01 = "mongodb+srv://quokka_wild:Quokka_25@cluster0-lzqcs.gcp.mongodb.net/";

mongoose.connect(uri_cluster_01, (err, res)=>{
    if(err) throw err;
    console.log('Conexion con MongoDB establecida');

    app.listen(3000, ()=>{
        console.log('API REST corriendo en el puerto 3000');
    });

});




//Test con MongoDB

const MongoClient = require('mongodb').MongoClient;

// replace the uri string with your connection string.
const uri = "mongodb+srv://quokka_wild:Quokka_25@cluster0-lzqcs.gcp.mongodb.net/";

MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }

   console.log('Connected...');

   //Insersion Simple
   const collection = client.db("proof").collection("proof");
   var myobj = { name: "Company Inc", address: "Highway 37" };
   collection.insertOne(myobj, function(err, res){
        if (err) throw err;
        console.log("1 document inserted");
        client.close();     
   });


   // perform actions on the collection object
   client.close();
});
*/



//Estado Original
/*
const express = require('express');
const mongoose = require('mongoose');

const uriDB = "mongodb+srv://quokka_wild:<Quokka_25>@cluster0-lzqcs.gcp.mongodb.net/";


const app = express();

app.set('port', process.env.PORT || 3000);

mongoose.connect(uriDB, (err, res)=>{
    if(err) throw err;
    console.log('Conexion con MongoDB establecida');

    app.listen(app.get('port'), ()=>{
        console.log('Server on port', app.get('port'));
    })
});

*/