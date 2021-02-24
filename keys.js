const crypto = require("crypto");

const access = crypto.randomBytes(32).toString("hex");
const refresh = crypto.randomBytes(32).toString("hex");
const email = crypto.randomBytes(32).toString("hex");
const password = crypto.randomBytes(32).toString("hex");

console.table({ mongo, access, refresh, email, password });
