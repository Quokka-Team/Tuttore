'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    career: {
        type: Schema.Types.ObjectId,
        required: true
    },
    gpa: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    courses: [{
        courseId: {
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
    profilePicture: {
        data: {
          type: Buffer,
          required: true
        },
        contentType: {
          type: String,
          required: true
        }
    },
    description: {
        type: String,
        required: true
    },
    availability: [{
        initialDate: {
          type: Date,
          required: true
        },
        finalDate: {
          type: Date,
          required: true
        }
    }],
    chat: [{
        receiverId: {
          type: Schema.Types.ObjectId,
          required: true
        },
        chatId: {
          type: Schema.Types.ObjectId,
          required: true
        }
    }]
});


StudentSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

StudentSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password, this.password);
};

StudentSchema.pre('save', function(next){
    let student=this;
    if(!student.isModified('password')) return next();

    student.password = student.encryptPassword(student.password);
    next();
});



module.exports = mongoose.model('Student', StudentSchema);

