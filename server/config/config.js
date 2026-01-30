import "dotenv/config";

export const url = process.env.DATABASE_URL;
export const dialect = "postgres";
export const logging = false;
export const dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};
