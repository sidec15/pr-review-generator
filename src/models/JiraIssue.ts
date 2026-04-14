import { JiraComment } from "./JiraComment";

export interface JiraIssue {
  id: string;
  key: string;
  title: string;
  description: string;
  comments: JiraComment[];
}
