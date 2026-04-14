import { JiraComment } from "../models/JiraComment";
import { JiraParent } from "../models/JiraParent";
import { PrComment } from "../models/PrComment";
import { PromptContext } from "../models/PromptContext";

export function generatePrompt(
  template: string,
  context: PromptContext,
): string {
  const values: Record<string, string> = {
    ARCHITECTURE: context.architecture,
    MODULE_SECTION: formatModuleSection(context.module),
    JIRA_PARENT_SECTION: formatJiraParentSection(context.jiraParent),
    JIRA_TITLE: context.jiraTitle,
    JIRA_DESCRIPTION: context.jiraDescription,
    JIRA_COMMENTS: formatJiraComments(context.jiraComments),
    PR_DESCRIPTION: context.prDescription || "No description provided.",
    PR_COMMENTS: formatPrComments(context.prComments),
  };

  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = values[key.trim()];
    return value ?? "";
  });
}

function formatModuleSection(module: string | undefined): string {
  if (!module) {
    return "";
  }
  return [
    `**Module:** ${module}`,
    "",
    `This PR targets the **${module}** module — when the attached resources contain module-specific rules, apply the ones for \`${module}\`.`,
  ].join("\n");
}

function formatJiraParentSection(parent: JiraParent | undefined): string {
  if (!parent) {
    return "";
  }
  return [
    "**Parent Jira Task:**",
    "",
    `- **Key:** ${parent.key}`,
    `- **Title:** ${parent.title}`,
    `- **Description:** ${parent.description}`,
  ].join("\n");
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

function formatJiraComments(comments: JiraComment[]): string {
  if (comments.length === 0) {
    return "No existing comments.";
  }

  return comments
    .map((c) => `- **${c.author}**: ${c.content}`)
    .join("\n");
}
