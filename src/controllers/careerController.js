'use strict'

const mongoose = require('mongoose');
const Career = require('../models/career');



async function addCareer(req, res){
    const career = new Career ({
        name: req.body.name,
        faculty: req.body.faculty
    });

    career.save((err) =>{
        if (err) res.status(500).send({message: `Error adding the career: ${err}`});

        return res.status(200).send({message: 'Career succesfully added'});
    });
};

module.exports = {
    addCareer
};

