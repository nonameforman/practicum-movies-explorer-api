const {
  PORT = 3000,
  MONGODB = 'mongodb://localhost:27017/moviesdb',
} = process.env;

module.exports = {
  PORT,
  MONGODB,
};
