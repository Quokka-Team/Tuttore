'use strict'

//Encargada del manejo de los token
const jwt = require('jwt-simple');

//Libreria para el funcionamiento del tiempo
const moment  = require('moment');

//Encargado de obtener algunas claves y demas
const config = require('../config');


function createToken(student){
    const payload={
        sub:student._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    }
    return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken(token){
    const decoded = new Promise((resolve, reject)=>{
        try{
            const payload = jwt.decode(token, config.SECRET_TOKEN);
            
            if(payload.exp<= moment().unix()){
                reject({
                    status: 401,
                    massage: 'El token ha expirado'
                });
            }
            resolve(payload.sub);
        }
        catch(err){
            reject({
                status:500,
                massage: 'Invalid Token'
            });
        }
    });

    return decoded;
}


module.exports = {createToken, decodeToken}