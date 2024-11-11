const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "username": 'postgres',
    "password": 'root',
    "database": 'Authentication',
    "host": '127.0.0.1',
    "dialect": 'postgres',
    'seederStorage': 'sequelize',
  },
  
 
}



/**
 * initially it will be in json formate but we need to convert it into json formate bt writeing module.export
 * 
 * pick the credentials based on the envorment if we use it in production it will pick production credentials ans so on
 */