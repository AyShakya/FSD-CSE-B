const os = require('os');

console.log("Operating System:", os.type());
console.log("Platform:", os.platform());
console.log("CPU Architecture:", os.arch());
console.log("Total Memory:", os.totalmem(), "bytes");
console.log("Free Memory:", os.freemem(), "bytes");
console.log("Home Directory:", os.homedir());
console.log("Uptime:", os.uptime(), "seconds");

const totalMemGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
const freeMemGB = (os.freemem() / (1024 ** 3)).toFixed(2);
console.log(`Total Memory: ${totalMemGB} GB`);

const userInfo = os.userInfo();
console.log("User Info:", userInfo);
console.log("Username:", userInfo.username);
              