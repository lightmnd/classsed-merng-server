const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
	validateRegisterInput,
	validateLoginInput
} = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

function generateToken (user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
		SECRET_KEY,
		{ expiresIn: '1h' }
	);
}

module.exports = {
  Query: {
		async getUser (_, { username }) {
      try {
        const user = await User.findOne({ username }); // .sort({ createdAt: -1 });
        if (user) {
          console.log(user)
					// console.log('>>>>>>>USERRRR', user)

					// if (user.files.find((file) => file.username === username)) {
					//   // Post already likes, unlike it
					//   user.files = user.files.filter((file) => file.username !== username);
					// } else {
					  user.files.push({
					    filename,
					    username,
					    mimetype,
					    encoding,
					    createdAt: new Date().toISOString()
					  });
					// }

					// // await user.save();
          return user;
        } else throw new Error('User not found'); // throw new UserInputError('Post not found');
				// if (user) {
				//   return user;
				// } else {
				//   throw new Error('User not found');
				// }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async login (_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });
      
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async register (
			_,
			{
				registerInput: { username, email, password, confirmPassword, files }
			}
		) {
			// Validate user data
      const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
			// TODO: Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
			// hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
				// files
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};
