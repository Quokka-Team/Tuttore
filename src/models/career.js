'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CareerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    }
});