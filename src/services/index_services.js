'use strict'

const jwt = require('jwt-simple');
const moment  = require('moment');
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