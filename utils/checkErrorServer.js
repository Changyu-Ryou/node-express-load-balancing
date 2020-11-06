const serverHandler = require("./serverHandler");
var request = require("request");

function req(url) {
  const errServerReq = request
    .get({ url: url })
    .on("error", (error) => {
      serverHandler.errServer.push(url);
    })
    .on("end", () => {
      serverHandler.serverList.push(url);
      console.log("복구 된 장애 서버: ", url);
    });
}

exports.start = () =>
  setInterval(() => {
    if (serverHandler.errServer.length !== 0) {
      req(serverHandler.errServer.shift());
    }
  }, 1000);
