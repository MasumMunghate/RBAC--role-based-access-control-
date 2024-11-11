"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/postgres.js");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/appError.js");
const project = require("./project.js");

const authuser = sequelize.define(
  "AuthUser",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userType: {
      type: DataTypes.ENUM("0", "1", "2"),
      // 0-admin, 1-seller, 2-buyer
      allowNull: false,
      validate: {
        notNull: {
          msg: "userType can not be null",
        },
        notEmpty: {
          msg: "userType can not be empty",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "firstName can not be null",
        },
        notEmpty: {
          msg: "firstName can not be empty",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "lastName can not be null",
        },
        notEmpty: {
          msg: "lastName can not be empty",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      isEmail: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email can not be null",
        },
        notEmpty: {
          msg: "Email can not be empty",
        },
        isEmail: {
          msg: "Invalid email id",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "password can not be null",
        },
        notEmpty: {
          msg: "password can not be empty",
        }

      },
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if(this.password.length < 7){
          throw new AppError("Password length must greater that 7", 400);
        }
        if (value === this.password) {
          const hassPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hassPassword);
        } else {
          throw new AppError("Password and confirmPassword must be same", 400);
        }
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    // paranoid: true,
    frezzetable: true,
    modelName: "AuthUser",
  }
);

authuser.hasMany(project,{foreignKey:'createdBy'})
project.belongsTo(authuser,{foreignKey:'createdBy'})
// authuser.sync({force:true});
module.exports = authuser;
