export interface PromptContext {
  projectName: string;
  architecture: string;
  jiraTitle: string;
  jiraDescription: string;
  prDescription: string;
  reviewerComments?: string[];
}
