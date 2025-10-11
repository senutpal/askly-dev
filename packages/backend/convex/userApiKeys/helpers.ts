"use node";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const MASTER_KEY = process.env.MASTER_KEY as string;
if (!MASTER_KEY) {
  throw new Error("MASTER_KEY environment variable is required");
}
const IV_LENGTH = 16;

function deriveKey(key: string): Buffer {
  return crypto.createHash("sha256").update(key).digest();
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(MASTER_KEY);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    content: encrypted,
    authTag: authTag.toString("hex"),
  };
}

export function decrypt(iv: string, content: string, authTag: string) {
  const key = deriveKey(MASTER_KEY);

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(content, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
