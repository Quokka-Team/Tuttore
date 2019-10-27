'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const CourseEmbeddedTutorSchema = new Schema({
  courseId: {
      type: Schema.Types.ObjectId,
      required: true
  },
  gpa: {
      type: Number
  },
  score:{
      type: Number
  },
  initialDate:{
      type: Date
  }
});

const StudentSchema = new Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    career: {
        type: String
    },
    gpa: {
        type: Number
    },
    phoneNumber: {
        type: String
    },
    courses:[CourseEmbeddedTutorSchema],

    profilePicture: {
        data: {
          type: Buffer
        },
        contentType: {
          type: String
        }
    },
    description: {
        type: String
    },
    isTutor : {
        type: Boolean
    },
    availability: [{
        initialDate: {
          type: Date
        },
        finalDate: {
          type: Date
        }
    }],
    chat: [{
        receiverId: {
          type: Schema.Types.ObjectId
        },
        chatId: {
          type: Schema.Types.ObjectId
        }
    }],
    dateCreated: {
        type: Date
    },
    career:{
      type:String
    }, 
    dateCreatedTutor:{
      type:Date
    }
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

