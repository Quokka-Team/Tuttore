const { google } = require('googleapis');
const fs = require('fs');

const credentials = require('../credentials/credentials-GoogleDriveAPI.json');

const scopes = [
    'https://www.googleapis.com/auth/drive'
];

const auth = new google.auth.JWT(
    credentials.client_email, null,
    credentials.private_key, scopes
  );

const drive = google.drive({ version: 'v3', auth });

    
async function uploadProfileImage(profilePicture, nameProfilePicture){
    
    await profilePicture.mv(`src/tmp/${nameProfilePicture}`, err=>{
        // if(err) return res.status(500).send({ message : 'No se ha podido cargar la imagen' })
        if(err){
            return;            
        }

    });


    let fileMetadata = {
        'name': nameProfilePicture
    };
    let media = {
        body: fs.createReadStream(`src/tmp/${nameProfilePicture}`)
    };


    let resUploadImage = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields:'id'
    });

    let resUpdateImage = await drive.files.update({
        fileId: resUploadImage.data.id,
        addParents: '1xhRRcBHFMuNYHdRaILsxFCoFKfj55Lr6',
        fields: 'id, parents'
    });


    fs.unlinkSync(`src/tmp/${nameProfilePicture}`);
    return resUploadImage.data.id;
}




// async function proof(){
//     drive.files.list({
//     fields: 'files(name, id)',
// }, (err, res) => {
//     if (err) throw err;
//     const files = res.data.files;
//     if (files.length) {
//     files.map((file) => {
//       console.log(file);
//     });
//     } else {
//       console.log('No files found');
//     }
//   });
// }


// async function downlandProfilePicture(idProfilePicture, nameProfilePicture){
//     let dest = fs.createWriteStream(`src/tmp/${nameProfilePicture}`);
//     drive.files.get({fileId: idProfilePicture, alt: 'media'}, {responseType: 'stream'},
//         function(err, res){
//             res.data
//             .on('end', () => {
//                 console.log('Done');
//             })
//             .on('error', err => {
//                 console.log('Error', err);
//             })
//             .pipe(dest);
//         }
//     );

//     // let popo = await drive.files.get({fileId: idProfilePicture, alt: 'media'}, {responseType: 'stream'});
//     // await popo.data.pipe(dest);
//     return;
// }



async function downlandProfilePicture(idProfilePicture, nameProfilePicture){
    let dest = fs.createWriteStream(`src/tmp/${nameProfilePicture}`);

    const downlandFile = (dest, idProfilePicture) => new Promise((resolve, reject)=>{
        drive.files.get({fileId: idProfilePicture, alt: 'media'}, {responseType: 'stream'},
        function(err, res){
            res.data
            .on('end', () => {
                console.log("chota");
                resolve();
            })
            .on('error', err => {
                reject();
            })
            .pipe(dest);
        }
    );
    });
    const downlandFiles = async (dest, idProfilePicture) => {
        await downlandFile(dest, idProfilePicture); 
    }

    await downlandFiles(dest, idProfilePicture);

    // let popo = await drive.files.get({fileId: idProfilePicture, alt: 'media'}, {responseType: 'stream'});
    // await popo.data.pipe(dest);
    return;
}




async function downlandPicture(idPicture){
    let dest = fs.createWriteStream(`src/tmp/${idPicture}.jpg`);

    const downlandFile = (dest, idPicture) => new Promise((resolve, reject)=>{
        drive.files.get({fileId: idPicture, alt: 'media'}, {responseType: 'stream'},
            function(err, res){
                res.data
                .on('end', () => {
                    resolve();
                })
                .on('error', err => {
                    reject();
                })
                .pipe(dest);
            }
        );
    });

    await downlandFile(dest, idPicture);

    return;
}





module.exports = {
    uploadProfileImage, downlandProfilePicture, downlandPicture
};