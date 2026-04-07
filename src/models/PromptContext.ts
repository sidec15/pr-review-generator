import { PrComment } from "./PrComment";

export interface PromptContext {
  architecture: string;
  jiraTitle: string;
  jiraDescription: string;
  prDescription: string;
  prComments: PrComment[];
}
