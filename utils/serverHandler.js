var request = require("request");

let serverList = [
  "http://localhost:5000",
  "http://xn--ht4ba298ahc.xn--hu5b25b77nvwc.xn--3e0b707e:5000",
  "http://localhost:3000",
];

let cur = 0;
let errServer = new Array();

// req, res logging
const logMiddleware = (req, res, next) => {
  const start = Date.now();
  console.log("Start req server => " + cur);
  res.on("finish", () => {
    console.log("Completed", req.method, req.url, Date.now() - start);
    console.log("\n");
  });
  next();
};

// 서버 분산 요청
const serverHandler = (req, res) => {
  const serverReq = request({ url: serverList[cur] + req.url }).on(
    "error",
    (error) => {
      healthCheck(req, res, error);
    }
  );
  req.pipe(serverReq).pipe(res);
  cur = (cur + 1) % serverList.length;
};

// server health check
function healthCheck(req, res, error) {
  let serverNum = prevServer(cur);

  const err = serverList.splice(serverNum, 1);
  errServer.push(err[0]);
  cur = prevServer(serverNum);
  console.log("에러", errServer, serverList);

  if (serverList.length === 0) {
    console.log("[모든 서버 장애] 대응가능한 서버 없음", serverList[serverNum]);
    return res.status(500).json(error.message);
  }
  serverHandler(req, res);
}

// 이전 서버url 인덱스 번호
function prevServer(cur) {
  let serverNum = cur - 1;
  if (serverNum < 0) {
    serverNum = serverList.length - 1;
  }
  return serverNum;
}

module.exports = { serverHandler, logMiddleware, serverList, errServer };
