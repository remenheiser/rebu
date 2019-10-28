const mongoose = require('mongoose');
const crypt = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: String,
  hash: String,
  salt: String,
});

export let setPassword = function(password: any) {
  this.salt = crypt.randomBytes(16).toString('hex');
  this.hash = crypt.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

export let validatePassword = function(password: any) {
  const hash = crypt.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

export let generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: (expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

export let toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

export let Users = mongoose.model('Users', UsersSchema);