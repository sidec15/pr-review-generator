import { PrComment } from "../models/PrComment";
import { PromptContext } from "../models/PromptContext";

export function generatePrompt(
  template: string,
  context: PromptContext,
): string {
  const values: Record<string, string> = {
    PROJECT_NAME: context.projectName,
    ARCHITECTURE: context.architecture,
    JIRA_TITLE: context.jiraTitle,
    JIRA_DESCRIPTION: context.jiraDescription,
    PR_DESCRIPTION: context.prDescription || "No description provided.",
    PR_COMMENTS: formatPrComments(context.prComments),
    REVIEWER_COMMENTS: context.reviewerComments?.join("\n") ?? "None.",
  };

  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = values[key.trim()];
    return value ?? "";
  });
}

function formatPrComments(comments: PrComment[]): string {
  if (comments.length === 0) {
    return "No existing comments.";
  }

  return comments
    .map((c) => {
      const location = c.isInline && c.filePath
        ? ` (file: \`${c.filePath}\`${c.line ? `, line ${c.line}` : ""})`
        : "";
      return `- **${c.author}**${location}: ${c.content}`;
    })
    .join("\n");
}
