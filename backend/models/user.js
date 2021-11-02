const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    reuired: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    minlength: 2,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

const rejectInvalidCredentials = () => Promise.reject(new Error('Неправильные почта или пароль'));

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return rejectInvalidCredentials();
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return rejectInvalidCredentials();
          }
          return user;
        });
    });
};

userSchema.path('avatar').validate((val) => {
  const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(val);
});

module.exports = mongoose.model('user', userSchema);
