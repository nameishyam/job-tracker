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
