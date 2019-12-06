'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const EventEmbeddedTutorSchema = new Schema({
    title: {
        type: String
    },
    start:{
        type: String
    },
    color:{
        type: String
    }, 
    textColor:{
        type: String
    },
    overlap:{
        type: String
    },
    selectable:{
        type: String
    }
  });

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
        type: Number
    },
    studentComment: {
        type: String
    },
    date: EventEmbeddedTutorSchema,
    tutorReport: {
        type: String
    },
    studentReport: {
        type: String
    },
    status:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Session', SessionSchema);



