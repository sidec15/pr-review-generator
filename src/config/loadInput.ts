import fs from "fs";
import path from "path";
import { InputConfig } from "../models/InputConfig";

export function loadInputConfig(inputPath: string): InputConfig {
  const absolutePath = path.resolve(inputPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Input file not found: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, "utf-8");
  const parsed = JSON.parse(raw) as InputConfig;

  validateInputConfig(parsed);

  return parsed;
}

function validateInputConfig(config: InputConfig): void {
  if (!config.projectArchitecture) {
    throw new Error("Missing required field: projectArchitecture");
  }

  if (!config.jiraTaskId) {
    throw new Error("Missing required field: jiraTaskId");
  }

  if (!config.bitbucketPullRequestUrl) {
    throw new Error("Missing required field: bitbucketPullRequestUrl");
  }

  if (config.mode && config.mode !== "first" && config.mode !== "follow-up") {
    throw new Error('mode must be "first" or "follow-up"');
  }
}
