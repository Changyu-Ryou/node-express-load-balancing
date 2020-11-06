var request = require("request");

const serverList = ["http://localhost:5000", "http://localhost:5000"];

let cur = 0;

exports.serverHandler = (req, res) => {
  console.log("post2");
  const serverReq = request({ url: serverList[cur] + req.url }).on(
    "error",
    (error) => {
      return res.status(500).json(error.message);
    }
  );
  req.pipe(serverReq).pipe(res);
  cur = (cur + 1) % serverList.length;
};
