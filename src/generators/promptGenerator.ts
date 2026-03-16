import { PromptContext } from "../models/PromptContext";

export function generatePrompt(template: string, context: PromptContext): string {
  const values: Record<string, string> = {
    PROJECT_NAME: context.projectName,
    ARCHITECTURE: context.architecture,
    JIRA_TITLE: context.jiraTitle,
    JIRA_DESCRIPTION: context.jiraDescription,
    PR_DESCRIPTION: context.prDescription,
    REVIEWER_COMMENTS: context.reviewerComments?.join("\n") ?? "",
  };

  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = values[key.trim()];
    return value ?? "";
  });
}
