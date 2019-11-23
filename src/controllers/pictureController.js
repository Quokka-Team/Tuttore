const GoogleDriveAPI = require('../services/googleDriveAPI');

const fs = require('fs');

async function getPicture(req, res){

    let idPicture = req.params.idPicture;
    
    
    await GoogleDriveAPI.downlandPicture(idPicture);
    
    
    let data = fs.readFileSync(`src/tmp/${idPicture}.jpg`);
    fs.unlinkSync(`src/tmp/${idPicture}.jpg`);

    
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data); 
    // res.send(idPicture);
}

module.exports = {
    getPicture
}
