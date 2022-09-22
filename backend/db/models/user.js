'use strict';
const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          length: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail) {
              throw new Error("Username shouldn't be email");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { length: [4, 30] },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        unique: true,
        validate: {
          length: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
