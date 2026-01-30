"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Job, {
        foreignKey: "userId",
        as: "jobs",
      });
      User.hasMany(models.Blogs, {
        foreignKey: "userId",
        as: "blogs",
      });
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

    static async findById({ id }) {
      const user = await User.findOne({ where: { id } });
      return user;
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
      bio: DataTypes.STRING,
      profile_url: DataTypes.STRING,
      resume_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
