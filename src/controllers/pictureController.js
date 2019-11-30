const GoogleDriveAPI = require('../services/googleDriveAPI');

const fs = require('fs');

async function getPicture(req, res){
    let idPicture;
    try{
        idPicture = req.params.idPicture;
        await GoogleDriveAPI.downlandPicture(idPicture);
    }
    catch(err){
        res.status(403).send({message: 'Failed Download Picture'});
    }

    let data;
    try{
        data = fs.readFileSync(`src/tmp/${idPicture}.jpg`);
        fs.unlinkSync(`src/tmp/${idPicture}.jpg`);
    }
    catch(err){
        res.status(403).send({message: 'Failed Process Picture'});
    }
    
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data); 
    // res.send(idPicture);
}

module.exports = {
    getPicture
}
