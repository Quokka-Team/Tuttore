function createFormatEmail(email, message, subject){
    
    let params = {
        Destination: {
        CcAddresses: [
            email
        ],
        ToAddresses: [
            email
        ]
        },
        Message: {
        Body: { 
            Html: {
            Charset: "UTF-8",
            Data: message
            },
            Text: {
            Charset: "UTF-8",
            Data: "TEXT_FORMAT_BODY"
            }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: subject
        }
        },
        Source: 'QuokkaTeam2019@gmail.com', 
        ReplyToAddresses: [
        'QuokkaTeam2019@gmail.com'
        ],
    };

    return params;

}

module.exports = createFormatEmail