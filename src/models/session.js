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
    end:{
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
        type: Schema.Types.ObjectId
    },

    student: {
        type: Schema.Types.ObjectId
    },

    course: {
        type: Schema.Types.ObjectId
    },

    studentScore: {
        type: Number
    },

    studentComment: {
        type: String
    },

    event: EventEmbeddedTutorSchema,
    
    tutorReport: {
        type: String
    },

    studentReport: {
        type: String
    },

    status:{
        type: String
    }
});

module.exports = mongoose.model('Session', SessionSchema);



