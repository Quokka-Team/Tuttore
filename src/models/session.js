'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const SessionSchema = new Schema({
    tutor : Schema.Types.ObjectId,
    student : Schema.Types.ObjectId,
    course : Schema.Types.ObjectId,
    studentScore : Number,
    studentComment : String,
    date : Date,
    reports : {
        student : String,
        tutor : String
    }


});




