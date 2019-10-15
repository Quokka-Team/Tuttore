'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    avaibleTutors: [{
        initialDate: {
          type: Date,
          required: true
        },
        tutor: {
          type: Schema.Types.ObjectId,
          required: true
        },
        gpa: {
          type: Number,
          required: true
        },
        score: {
          type: Number,
          required: true
        }
    }],
    dateCreated : {
        type: Date
    }
});