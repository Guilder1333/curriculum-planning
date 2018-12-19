const crypto = require("crypto");

let array = new Int32Array(1);
crypto.randomFillSync(array, 0, 1);
console.log(array[0]);

const loginFailedError = 0x100001;
/*new Promise(function (resolve, reject) {
  setTimeout(function () {
    console.log("chain 0");
    resolve('foo');
  }, 300);
})
  .then(() => {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log("chain 1");
        resolve('another');
      }, 300);
    }).then((res) => {
      console.log(res);
    }).then((res) => {
      console.log(res);
    });
  })
  .then(() => {
    console.log("chain error");
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        reject(loginFailedError);
      }, 300);
    });
  })
  .then((res) => {
    console.log("not happening");
    return res;
  })
  .catch(async (err) => {
    await new Promise((resolve, reject) => {
      setTimeout(function () {
        console.log("error chain 1");
        resolve('ok');
      }, 300);
    }).then((res) => {
      console.log(res);
    });
    console.log(err === loginFailedError);
    console.error(err);
  })
  .finally((res) => console.log(res))
  .then((res) => console.log(res));*/