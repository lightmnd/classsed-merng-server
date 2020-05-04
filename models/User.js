const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
	// files: Array
  files: [
    {
      filename: String,
      mimetype: String,
      encoding: String,
      createdAt: String
    }
  ]
});

module.exports = model('User', userSchema);
