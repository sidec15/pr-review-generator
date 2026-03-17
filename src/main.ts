import dotenv from "dotenv";
import path from "path";
import { loadInputConfig } from "./config/loadInput";
import { generatePrompt } from "./generators/promptGenerator";
import { BitbucketService } from "./services/bitbucketService";
import { JiraService } from "./services/jiraService";
import { writeFile } from "./utils/fileUtils";
import { loadTemplate } from "./utils/templateLoader";

dotenv.config();

async function main(): Promise<void> {
  const inputPath = process.argv[2];

  if (!inputPath) {
    throw new Error("Usage: npm run dev -- <input.json>");
  }

  const config = loadInputConfig(inputPath);
  const outputDir = path.dirname(path.resolve(inputPath));

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
  const template = loadTemplate("code-review-template.md");

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
  writeFile(outputDir, "prompt.md", prompt);
  writeFile(outputDir, "diff.patch", diff);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
