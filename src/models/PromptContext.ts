import { JiraComment } from "./JiraComment";
import { JiraParent } from "./JiraParent";
import { PrComment } from "./PrComment";

export interface PromptContext {
  architecture: string;
  module?: string;
  jiraTitle: string;
  jiraDescription: string;
  jiraComments: JiraComment[];
  jiraParent?: JiraParent;
  prDescription: string;
  prComments: PrComment[];
}
