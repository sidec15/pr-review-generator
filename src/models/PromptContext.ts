import { PrComment } from "./PrComment";

export interface PromptContext {
  projectName: string;
  architecture: string;
  jiraTitle: string;
  jiraDescription: string;
  prDescription: string;
  prComments: PrComment[];
  reviewerComments?: string[];
}
