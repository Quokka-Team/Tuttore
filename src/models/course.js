'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name : String,
    code : String,
    avaibleTutors : [{
        tutor : Schema.Types.ObjectId,
        gpa : Number,
        score : Number
    }]

});