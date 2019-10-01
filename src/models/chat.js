'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    user1Id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user2Id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user1Messages: [{
        date: {
          type: Date,
          required: true
        },
        content: {
          type: String,
          required: true
        },
        state: {
          type: Boolean,
          required: true
        }
    }],
    user2Messages: [{
        date: {
          type: Date,
          required: true
        },
        content: {
          type: String,
          required: true
        },
        state: {
          type: Boolean,
          required: true
        }
    }]
});

module.exports = mongoose.model('Chat', ChatSchema);