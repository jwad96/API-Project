'use strict';
const bcrypt = require('bcryptjs');
const { Model, Validator, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, username, email } = this;
      return { id, username, email };
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static async getCurrentUserById(id) {
      return await User.scope('currentUser').findByPk(id);
    }

    static async login(credential, password) {
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential,
          },
        },
      });

      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
      });

      return await User.scope('currentUser').findByPk(user.id);
    }

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
      defaultScope: {
        attributes: {
          exclude: ['email', 'hashedPassword', 'updatedAt', 'createdAt'],
        },
      },
      scopes: {
        currentUser: {
          attributes: {
            exclude: ['hashedPassword'],
          },
        },

        loginUser: {},
      },
    }
  );
  return User;
};
