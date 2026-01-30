"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Blogs extends Model {
    static associate(models) {
      Blogs.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Blogs.init(
    {
      company: DataTypes.STRING,
      review: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
      salary: DataTypes.STRING,
      rounds: DataTypes.ARRAY(DataTypes.STRING),
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Blogs",
    },
  );
  return Blogs;
};
