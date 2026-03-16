import dotenv from "dotenv";
import path from "path";
import { loadInputConfig } from "./config/loadInput";
import { loadTemplate } from "./utils/templateLoader";
import { generatePrompt } from "./generators/promptGenerator";
import { writeFile } from "./utils/fileUtils";
import { parseBitbucketPrUrl } from "./utils/bitbucketUrlParser";

dotenv.config();

async function main(): Promise<void> {
  const inputPath = process.argv[2];

  if (!inputPath) {
    throw new Error("Usage: npm run dev -- <input.json>");
  }

  const config = loadInputConfig(inputPath);
  const outputDir = path.dirname(path.resolve(inputPath));

  const parsed = parseBitbucketPrUrl(config.bitbucketPullRequestUrl);

  console.log("Parsed Bitbucket URL:", parsed);

  const template = loadTemplate("code-review-template.md");

  const prompt = generatePrompt(template, {
    projectName: config.projectName,
    architecture: config.projectArchitecture,
    jiraTitle: "TEMP TITLE",
    jiraDescription: "TEMP DESCRIPTION",
    prDescription: "TEMP PR DESCRIPTION",
    reviewerComments: config.existingComments,
  });

  writeFile(outputDir, "review-prompt.md", prompt);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
