'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const StudentSchema = new Schema({
    name : String,
    lastName : String,
    email : String,
    career : Schema.Types.ObjectId,
    signupDate : {type: Date, default: Date.now()},
    papa: Number,
    phoneNumber: String,

    courses : [{
        courseId : Schema.Types.ObjectId, 
        gpa : Number,
        score : Number
    }],
    profilePicture: {
        data:Buffer,
        contentType : String
    },
    description: String 

});








