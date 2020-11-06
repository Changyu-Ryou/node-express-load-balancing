var request = require("request");

const serverList = [
  "http://localhost:5000",
  "http://이슈잇슈.홈페이지.한국:5000",
];

let cur = 0;

exports.logMiddleware = (req, res, next) => {
  const start = Date.now();
  console.log("Start", serverList[cur], "서버 번호" + cur);
  res.on("finish", () => {
    console.log("Completed", req.method, req.url, Date.now() - start);
    console.log("\n");
  });
  next();
};

exports.serverHandler = (req, res) => {
  const serverReq = request({ url: serverList[cur] + req.url }).on(
    "error",
    (error) => {
      return res.status(500).json(error.message);
    }
  );
  req.pipe(serverReq).pipe(res);
  cur = (cur + 1) % serverList.length;
};
