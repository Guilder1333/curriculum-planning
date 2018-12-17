
new Promise(function (resolve, reject) {
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
        reject(new Error("failed"));
      }, 300);
    });
  })
  .then(() => {
    console.log("not happening");
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
    console.error(err);
  });