'use strict'
const services = require('../services/index_services');


function isAuth(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Not have authorization please login'});
    }

    const token = req.headers.authorization.split(" ")[1];

    services.decodeToken(token)
        .then(response =>{
            req.student = response;
            next();
        })
        .catch(response =>{
            res.status(401).send({message: 'Invalid Token', err:response});
        });
}


//Se exporta el middlewares
module.exports = isAuth;