const { Client } = require("pg");
const uuidv4 = require("uuid/v4");
const md5 = require("md5");
const randomString = require("random-string");
const dataBaseName = 'studyplan';

const salt = "C%W<mIMjXAY+I>{";

/*
login process:
1. Check login id and guid from cookies. If ok - logged in, if not ok proceed to 2.
2. Check user by email. Create login info. If user doesn't exist, create user with "deleteOnLogout" option.
3.
 */

class DataBaseClient {
  constructor() {
    const url = process.env.DATABASE_URL || "postgres://postgres:root@localhost:5432/studyplan";
    console.log(url);
    this.client = new Client({
      connectionString: url,
      ssl: false
    });
  }

  async createDatabase() {
    return this.client.connect()
      .then(() => this.client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'users_schema'"))
      .then((res) => {
        if (res.rowCount > 0) {
          for (let i = 0; i < res.rowCount; i++) {
            if (res.rows[i].table_name === "login_info") {
              // ok, tables are here
              return;
            }
          }
        }
        return this.client.query("CREATE SCHEMA IF NOT EXISTS users_schema")
          .then(() => this.client.query("CREATE TABLE IF NOT EXISTS users_schema.login_info (id integer primary key, verify_guid char(36), user_id integer unique, delete_user boolean, last_login timestamp with time zone)"))
          .then(() => this.client.query("CREATE TABLE IF NOT EXISTS users_schema.user (id integer primary key, email varchar(255) unique, password varchar(32), random_password boolean, teacher boolean)"));
      });
  }

  checkLoginInfo(id, uid) {
    this.client.connect()
      .then(() => this.client.query("BEGIN"))
      .then(() => this.client.query({
        text: "SELECT verifyGuid FROM users_schema.login_info WHERE id = $1", //  FOR UPDATE OF users_schema.login_info
        values: [parseInt(id) || -1],
        rowMode: "array"
      }))
      .then((res) => {
        if (res.rowCount === 1 && res.rows[0][0] === uid) {
          return this.client.query("UPDATE users_schema.login_info SET last_login = $1", [new Date()])
            .then(() => this.client.query("COMMIT"))
            .then(() => true);
        }
        return false;
      })
      .catch(async (err) => {
        await this.client.query("ROLLBACK");
        console.error(err);
        throw err;
      })
      .then(() => this.client.end());
  }

  beginAuth(email) {
    const guid = uuidv4();
    this.client.connect()
      .then(() => this.client.query("BEGIN"))
      .then(() => this.client.query({
        text: "SELECT li.id, u.id, u.random_password, u.password FROM users_schema.user as u LEFT JOIN users_schema.login_info as li ON u.id = li.user_id WHERE email = $1",
        values: [email],
        rowMode: "array"
      }))
      .then((res) => {
        if (res.rowCount) {
          const record = res.rows[0];
          if (record[2]) { // random_password
            const password = md5(salt + randomString({length: 12, special: true}));
            return this.client.query("UPDATE users_schema.user SET password = $1", [password])
              .then(() => ({
                password: password,
                loginId: record[0],
                userId: record[1]
              }));
          }
          return {
            password: record[3],
            loginId: record[0],
            userId: record[1]
          };
        }
      })
  }
}

module.exports = {
  create: () => {
    return new DataBaseClient();
  }
};