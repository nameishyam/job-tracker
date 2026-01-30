"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      Job.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Job.init(
    {
      jobtitle: DataTypes.STRING,
      company: DataTypes.STRING,
      location: DataTypes.STRING,
      jobtype: DataTypes.STRING,
      salary: DataTypes.STRING,
      description: DataTypes.TEXT,
      date: DataTypes.DATEONLY,
      roundStatus: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      review: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Job",
    },
  );
  return Job;
};
