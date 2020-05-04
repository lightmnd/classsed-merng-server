require('dotenv').config({ path: __dirname + '/.env' });

// module.exports = {
//   MONGODB:
//     'mongodb+srv://classsed:6lxxxlexaTslHLPe@cluster0-pcsru.mongodb.net/merng?retryWrites=true',
//   SECRET_KEY: 'some very secret key'
// };
module.exports = {
	MONGODB: 'mongodb://lightmnd:Agata2009|@ds161894.mlab.com:61894/merng',
	SECRET_KEY: process.env.SECRET
};
