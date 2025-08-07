const crypto = require("crypto");
const { seceretKey } = require("./config");

// Ensure the key is 32 bytes (256-bit) by hashing it
const secretKey = crypto.createHash('sha256').update(seceretKey).digest(); // 32 bytes key for AES-256

// Generate a random IV for each encryption operation
function generateIv() {
  return crypto.randomBytes(16); // 16 bytes for AES
}

// Encrypt function (AES-CBC)
function encrypt(text) {
  const iv = generateIv();
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return both the encrypted text and the IV
  return iv.toString("hex") + ":" + encrypted;
}

// Decrypt function (AES-CBC)
function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(":"); // Split the IV and encrypted data
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };