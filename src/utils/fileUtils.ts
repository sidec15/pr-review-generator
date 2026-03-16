import fs from "fs";
import path from "path";

export function writeFile(directory: string, filename: string, content: string): void {
  const fullPath = path.join(directory, filename);

  fs.writeFileSync(fullPath, content, "utf-8");

  console.log(`Created file: ${fullPath}`);
}
