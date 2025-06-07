"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.associate = function (models) {
        User.hasMany(models.Job, {
          foreignKey: "userId",
          as: "jobs",
        });
      };
    }

    static async createUser({ firstName, lastName, password, email }) {
      return await User.create({
        firstName,
        lastName,
        password,
        email,
      });
    }

    static async findUser({ email }) {
      return await User.findOne({
        where: {
          email,
        },
      });
    }

    static async findId({ email }) {
      const user = User.findOne({
        where: {
          email,
        },
      });
      const userId = user.Id;
      return userId;
    }
  }

  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
