import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

function getKey(): Buffer {
    const keyStr = process.env.ENCRYPTION_KEY || "default_unsafe_encryption_key_32b";
    return crypto.createHash("sha256").update(keyStr).digest();
}

/**
 * Deterministic encryption for phone numbers so we can query them in the database 
 * using standard equality (.eq) checks. 
 * We derive a static IV from the key to ensure the same plaintext always produces 
 * the same ciphertext.
 */
function getDeterministicIv(): Buffer {
    // 16 bytes for AES CBC IV
    return crypto.createHash("md5").update(getKey()).digest();
}

export function encryptPhone(text: string): string {
    if (!text) return text;
    
    const iv = getDeterministicIv();
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    
    return encrypted;
}

export function decryptPhone(encryptedText: string): string {
    if (!encryptedText) return encryptedText;
    
    // Check if it's already plaintext (e.g., during migration)
    if (/^\+?[0-9\s\-]+$/.test(encryptedText) && encryptedText.length < 20) {
        return encryptedText;
    }
    
    try {
        const iv = getDeterministicIv();
        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
        
        let decrypted = decipher.update(encryptedText, "base64", "utf8");
        decrypted += decipher.final("utf8");
        
        return decrypted;
    } catch (err) {
        console.error("Failed to decrypt phone number", err);
        const { alertEncryptionError } = require("./monitoring/security-alerts");
        alertEncryptionError("decrypt", String(err));
        return encryptedText;
    }
}
