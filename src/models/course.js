'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TuttorEmbeddedCourseSchema = new Schema({
    initialDate:{
      type: Date
    }, 
    tutor:{
      type: Schema.Types.ObjectId
    },
    gpa:{
      type: Number
    },
    score:{
      type: Number
    }
});

const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    dateCreated : {
        type: Date
    },
    avaibleTutors: [TuttorEmbeddedCourseSchema]
});


module.exports = mongoose.model('Course', CourseSchema);