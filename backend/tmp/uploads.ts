import path from "path";
import fs from "fs";

const uploadDir = path.join("tmp", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
