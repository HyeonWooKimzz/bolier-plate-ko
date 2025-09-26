const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        unique: 1
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ){
    var user = this;
    
    if(user.isModified('password')) {
        // 비밀번호 암호화 진행
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }   
})

userSchema.methods.comparePassword = function(plainPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
            if (err) reject(err);
            else resolve(isMatch);
        });
    });
}

userSchema.methods.genToken = async function() {
  try {
    const user = this;
    const token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    await user.save();
    return user;
  } catch (err) {
    throw err;
  }
};

userSchema.statics.findByToken = async function(token) {
    const userModel = this;

    try {
        // JWT Token Decoded
        const decoded = jwt.verify(token, 'secretToken');
        //Decode한 ID로 User 찾기
        const user = await userModel.findOne({ _id: decoded, token: token });

        return user;
    } catch (err) {
        throw err;
    }
};

const User = mongoose.model('User', userSchema)

module.exports = { User }