import { JiraComment } from "./JiraComment";
import { JiraParent } from "./JiraParent";

export interface JiraIssue {
  id: string;
  key: string;
  title: string;
  description: string;
  comments: JiraComment[];
  parent?: JiraParent;
}
