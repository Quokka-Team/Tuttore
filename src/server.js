
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