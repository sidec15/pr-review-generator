import fs from "fs";
import path from "path";

export function loadTemplate(templateName: string): string {
  const templatePath = path.resolve(__dirname, "../templates", templateName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  return fs.readFileSync(templatePath, "utf-8");
}
