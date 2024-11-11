const { Sequelize } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const db = require('../db/models/user')

const getAllUser = catchAsync(async (req, res, next) => {
    const users = await db.authuser.findAndCountAll({
        where: {
            userType: {
                [Sequelize.Op.ne]: '0',
            },
        },
        attributes: { exclude: ['password'] },
    });
    return res.status(200).json({
        status: 'success',
        data: users,
    });
});

module.exports = { getAllUser };