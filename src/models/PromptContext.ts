import { PrComment } from "./PrComment";

export interface PromptContext {
  architecture: string;
  module?: string;
  jiraTitle: string;
  jiraDescription: string;
  prDescription: string;
  prComments: PrComment[];
}
