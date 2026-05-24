const bcrypt = require("bcryptjs");

const password = "iotes@NPU2026";
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log("PASSWORD:", password);
console.log("HASH:", hash);
