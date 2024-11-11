const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
module.exports = {
  up: (queryInterface, Sequelize) => {
    const password = process.env.PASSWORD;
    const hashpassword = bcrypt.hashSync(password , 10)
    return queryInterface.bulkInsert('AuthUsers', [
      {
        userType:'0',
        firstName: process.env.FIRST_NAME,
        lastName: process.env.LAST_NAME,
        email: process.env.EMAIL,
        password:hashpassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AuthUsers', {userType:'0'}, {});
  },
};