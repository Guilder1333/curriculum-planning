const { Client } = require("pg");
const uuidv4 = require("uuid/v4");
const md5 = require("md5");
const randomString = require("random-string");
const crypto = require("crypto");
const { databaseParams, loginFailedError, duplicateUserRegistrationError, registrationFailedError } = require("./params.js");

/*
login process:
1. Check login id and guid from cookies. If ok - logged in, if not ok proceed to 2.
2. Check user by email. Create login info. If user doesn't exist, create user with "deleteOnLogout" option.
3.
 */

class DataBaseClient {
  constructor() {
    const url = process.env.DATABASE_URL || databaseParams.connectionString;
    console.log(url);
    this.client = new Client({
      connectionString: url,
      ssl: databaseParams.ssl
    });
  }

  async createDatabase() {
    return this.client.connect()
      .then(() => this.client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'users_schema'"))
      .then((res) => {
        if (res.rowCount > 0) {
          for (let i = 0; i < res.rowCount; i++) {
            if (res.rows[i].table_name === "user_list") {
              // ok, tables are here
              return;
            }
          }
        }
        return this.client.query("CREATE SCHEMA IF NOT EXISTS users_schema")
          .then(() => this.client.query("CREATE TABLE IF NOT EXISTS users_schema.user_list (id serial primary key, email varchar(255) unique, password varchar(32), random_password boolean, teacher boolean, full_name varchar(255), group_name varchar(255), login_id int, verify_guid char(36), confirmed boolean default false , last_login timestamp with time zone)"));
      });
  }

  checkLoginInfo(id, uid) {
    return this.client.connect()
      .then(() => this.client.query(
        "SELECT id, confirmed FROM users_schema.user_list WHERE login_id = $1 AND verify_guid = $2", //  FOR UPDATE OF users_schema.user_list
        [parseInt(id) || 0, uid || null]
      ))
      .then((res) => {
        if (res.rowCount === 1) {
          if (res.rows[0].confirmed) {
            // exact equality and only one, otherwise relogin
            return this.client.query("UPDATE users_schema.user_list SET last_login = $1 WHERE id = $2", [new Date(), res.rows[0].id])
              .then(() => "ok");
          }
          return "ok";
        }
        return "failed";
      })
      .finally(() => this.client.end());
  }

  beginAuth(email) {
    return this.client.connect()
      .then(() => this.client.query({
        text: "SELECT id, random_password FROM users_schema.user_list WHERE email = $1",
        values: [email],
        rowMode: "array"
      }))
      .then((res) => {
        if (res.rowCount === 1) {
          const record = res.rows[0];
          if (record[1]) { // random_password
            const code = randomString({length: 12, special: true});
            const hash = md5(databaseParams.salt + code);
            return this.client.query("UPDATE users_schema.user_list SET password = $1 WHERE id = $2", [hash, record[0]])
              .then(() => ({
                login: true,
                password: false,
                code: code
              }));
          }
          return {
            login: true,
            password: true,
            code: null
          };
        }
        return {
          login: false,
          password: true,
          code: null
        };
      })
      .finally(() => this.client.end());
  }

  login(email, password) {
    const hash = md5(databaseParams.salt + password);
    return this.client.connect()
      .then(() => this.client.query("SELECT id, confirmed FROM users_schema.user_list WHERE email = $1 AND password = $2", [email, hash]))
      .then((res) => {
        if (res.rowCount !== 1) {
          return {status: "fail"};
        }
        if (!res.rows[0].confirmed) {
          return {status: "confirm"};
        }
        const userId = res.rows[0].id;
        const loginIdArray = new Int32Array(1);
        crypto.randomFillSync(loginIdArray, 0, 1);
        const guid = uuidv4();
        return this.client.query(
          "UPDATE users_schema.user_list SET verify_guid = $1, login_id = $2, last_login = $3 WHERE id = $4",
          [guid, loginIdArray[0], new Date(), userId])
          .then(() => ({
            status: "ok",
            loginId: loginIdArray[0],
            verifyGuid: guid
          }));
      })
      .finally(() => this.client.end());
  }

  register(email, password, name, group, teacher, randomPassword) {
    return this.client.connect()
      .then(() => this.client.query("SELECT id, confirmed FROM users_schema.user_list WHERE email = $1", [email]))
      .then((res) => {
        if (res.rowCount === 1 && res.rows[0].confirmed) {
          // user can re-register if user is not confirmed.
          throw duplicateUserRegistrationError;
        }
        const loginIdArray = new Int32Array(1);
        crypto.randomFillSync(loginIdArray, 0, 1);
        const guid = uuidv4();
        if (randomPassword) {
          password = randomString({length: 12, special: true});
        }
        const hash = md5(databaseParams.salt + password);
        return this.client.query("INSERT INTO users_schema.user_list (email, password, full_name, group_name, verify_guid, login_id, last_login, teacher, randomPassword) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
          [email, hash, name, group, guid, loginIdArray[0], new Date(), !!teacher, !!randomPassword])
          .then((res) => {
            if (res.rowCount !== 1) {
              return null;
            }
            const confirmationHash = md5(guid + databaseParams.confirmationSalt + res.rows[0].id + databaseParams.confirmationSalt);
            return {
              loginId: loginIdArray[0],
              verifyGuid: guid,
              password: false,
              confirmationHash: confirmationHash
            };
          });
      })
      .finally(() => this.client.end());
  }

  confirmRegistration(email, id) {
    return this.client.connect()
      .then(() => this.client.query("SELECT id, verify_guid FROM users_schema.user_list WHERE email = $1", [email]))
      .then((res) => {
        if (res.rowCount === 1) {
          const confirmationHash = md5(res.rows[0].verify_guid + databaseParams.confirmationSalt + res.rows[0].id + databaseParams.confirmationSalt);
          if (id !== confirmationHash) {
            return "failed";
          }
          return this.client.query("UPDATE users_schema.user_list SET last_login = $1, confirmed = $2 WHERE id = $3", [new Date(), true, res.rows[0].id])
            .then(() => "ok");
        }
        return "outdated";
      })
      .finally(() => this.client.end());
  }
}

module.exports = {
  create: () => {
    return new DataBaseClient();
  }
};