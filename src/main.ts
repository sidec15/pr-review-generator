#!/usr/bin/env node
import dotenv from "dotenv";
import path from "path";
import { parseArgs } from "util";
import { loadInputConfig } from "./config/loadInput";
import { generatePrompt } from "./generators/promptGenerator";
import { BitbucketService } from "./services/bitbucketService";
import { JiraService } from "./services/jiraService";
import { writeFile } from "./utils/fileUtils";
import codeReviewTemplate from "./templates/code-review-template.md";

dotenv.config({ quiet: true });

function printHelp(): void {
  console.log(`Usage: pr-review-generator [options]

Options:
  -i, --input <path>   Path to the input JSON file (default: input.json)
  -o, --output <dir>   Output directory for generated files (default: input file directory)
  -h, --help           Show this help message`);
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      input: { type: "string", short: "i", default: "input.json" },
      output: { type: "string", short: "o" },
      help: { type: "boolean", short: "h", default: false },
    },
    strict: true,
  });

  if (values.help) {
    printHelp();
    process.exit(0);
  }

  const inputPath = values.input!;
  const config = loadInputConfig(inputPath);
  const outputDir = values.output
    ? path.resolve(values.output)
    : path.dirname(path.resolve(inputPath));

  const bitbucket = new BitbucketService();
  const jira = new JiraService();

  // Fetch Bitbucket data in parallel
  console.log("Fetching PR data from Bitbucket...");
  const [prInfo, diff, prComments] = await Promise.all([
    bitbucket.getPullRequestInfo(config.bitbucketPullRequestUrl),
    bitbucket.getPullRequestDiff(config.bitbucketPullRequestUrl),
    bitbucket.getPullRequestComments(config.bitbucketPullRequestUrl),
  ]);

  console.log(`PR: ${prInfo.title} (${prInfo.sourceBranch} → ${prInfo.targetBranch})`);
  console.log(`Fetched ${prComments.length} PR comment(s).`);

  // Fetch Jira issue
  console.log(`Fetching Jira issue ${config.jiraTaskId}...`);
  const jiraIssue = await jira.getIssue(config.jiraTaskId);
  console.log(`Jira: ${jiraIssue.key} — ${jiraIssue.title}`);

  // Build prompt
  const template = codeReviewTemplate;

  const prompt = generatePrompt(template, {
    projectName: config.projectName,
    architecture: config.projectArchitecture,
    jiraTitle: jiraIssue.title,
    jiraDescription: jiraIssue.description,
    prDescription: prInfo.description,
    prComments,
    reviewerComments: config.existingComments,
  });

  // Write outputs
  writeFile(outputDir, `${config.jiraTaskId}-review-prompt.md`, prompt);
  writeFile(outputDir, `${config.jiraTaskId}-pr.diff`, diff);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
