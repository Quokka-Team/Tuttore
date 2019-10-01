'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const SessionSchema = new Schema({
    tutor: {
        type: Schema.Types.ObjectId,
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        required: true
    },
    studentScore: {
        type: Number,
        required: true
    },
    studentComment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    tutorReport: {
        type: String,
        required: true
    },
    studentReport: {
        type: String,
        required: true
    }
});




