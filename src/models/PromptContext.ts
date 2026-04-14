import { JiraComment } from "./JiraComment";
import { PrComment } from "./PrComment";

export interface PromptContext {
  architecture: string;
  module?: string;
  jiraTitle: string;
  jiraDescription: string;
  jiraComments: JiraComment[];
  prDescription: string;
  prComments: PrComment[];
}
