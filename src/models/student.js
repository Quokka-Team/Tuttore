'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const StudentSchema = new Schema({
    name : String,
    lastName : String,
    email : String,
    password : String,
    career : Schema.Types.ObjectId,
    signupDate : {type: Date, default: Date.now()},
    papa: Number,
    phoneNumber: String,

    courses : [{
        courseId : Schema.Types.ObjectId, 
        gpa : Number,
        score : Number
    }],
    profilePicture: {
        data:Buffer,
        contentType : String
    },
    description: String 

});


StudentSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

StudentSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password, this.password);
};


// TODO
StudentSchema.pre('save', function(next){
    let student=this;
    if(!student.isModified('password')) return next();

    student.password = student.encryptPassword(student.password);
    next();
});



module.exports = mongoose.model('Student', StudentSchema);

