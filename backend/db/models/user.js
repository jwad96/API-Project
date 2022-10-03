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

    static async login({ credential, password }) {
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

    static async signup({ firstName, lastName, username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        hashedPassword,
      });

      return await User.scope('currentUser').findByPk(user.id);
    }

    static associate(models) {
      // define association here
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',
        as: 'properties',
      });

      User.hasMany(models.Review, {
        foreignKey: 'userId',
        as: 'userReview',
      });

      User.belongsToMany(models.Spot, {
        through: models.Booking,
        foreignKey: 'userId',
        as: 'booker',
      });

      User.hasMany(models.Booking, {
        foreignKey: 'userId',
      });

      // User.belongsToMany(models.Spot, {
      //   through: models.Review,
      //   foreignKey: 'userId',
      //   as: 'reviewer',
      // });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Username shouldn't be email");
            }
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { len: [4, 30] },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        unique: true,
        validate: {
          len: [60, 60],
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
