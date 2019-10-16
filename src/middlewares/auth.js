'use strict'
//Se llama al servicio que maneja el token, el manejo consiste en crearlo y decodificarlo
const services = require('../services/index_services');


//middlewares que permite la autentificacion
function isAuth(req, res, next){
    //Se revisa si almenos existe el token
    if(!req.headers.authorization){
        return res.status(403).send({message: 'No tienes Autorizacion'});
    }

    //Se extrae el token del header 
    const token = req.headers.authorization.split(" ")[1];

    //Se llama a la funcion decode y se procesa la promesa
    services.decodeToken(token)
        //Si todo el correcto se anade el contenido de token a la solicitud
        .then(response =>{
            req.student = response;
            next();
        })
        //Si se produce un error se informa
        .catch(response =>{
            res.status(response.status);
        });
}


//Se exporta el middlewares
module.exports = isAuth;