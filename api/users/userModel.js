const pool = require("../../config/db");

module.exports = {
  create: async (data, callback) => {
    await pool.query(
      `
            INSERT INTO student VALUES(?,?,?,?,?,?,?,?,?,?);
        `,
      [
        data.id,
        data.password,
        data.name,
        data.age,
        data.address,
        data.gender,
        data.is_admin,
        data.gpa,
        data.ref_college,
        data.ref_department,
      ],
      (error, result, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, fields);
      }
    );
  },
  getUsers: (callback) => {
    pool.query(
      `
      SELECT id,name,age,address,gender,gpa FROM student;
    `,
      [],
      (err, result, fields) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result);
      }
    );
  },
  getUserById: (id, callback) => {
    pool.query(
      `
      SELECT id,name,age,address,gender,gpa FROM student where id = ?;
        `,
      [id],
      (error, result, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, result[0]);
      }
    );
  },
  updateUserById: (data, callback) => {
    pool.query(
      `
            UPDATE student SET password=?,name=?,age=?,address=?,gender=?,gpa=? where id=?;
        `,
      [
        data.password,
        data.name,
        data.age,
        data.address,
        data.gender,
        data.gpa,
        data.id,
      ],
      (error, result, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, result[0]);
      }
    );
  },
  deleteUserById: async (id, callback) => {
    await pool.query(
      `
            DELETE from student where id=?;
        `,
      [id],
      (error, result, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, result);
      }
    );
  },
  getUserDataById: (id, callback) => {
    pool.query(
      `
      SELECT * FROM student where id = ?
        `,
      [id],
      (error, result, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, result[0]);
      }
    );
  },
};
