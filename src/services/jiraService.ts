import { AxiosInstance } from "axios";
import { JiraIssue } from "../models/JiraIssue";
import { JiraComment } from "../models/JiraComment";
import { createJiraClient } from "./jiraClient";

export class JiraService {
  private client: AxiosInstance;

  constructor() {
    this.client = createJiraClient();
  }

  async getIssue(issueKey: string): Promise<JiraIssue> {
    const response = await this.client.get(
      `/rest/api/3/issue/${issueKey}`,
      { params: { fields: "summary,description,comment" } },
    );

    const data = response.data;
    const rawComments = (data.fields?.comment?.comments ?? []) as unknown[];

    return {
      id: data.id,
      key: data.key,
      title: data.fields.summary ?? "",
      description: extractTextFromAdf(data.fields.description),
      comments: rawComments.map(parseJiraComment),
    };
  }
}

function parseJiraComment(raw: unknown): JiraComment {
  const c = raw as Record<string, unknown>;
  const author = c.author as Record<string, unknown> | undefined;
  return {
    author: (author?.displayName as string) ?? "Unknown",
    content: extractTextFromAdf(c.body),
    createdOn: (c.created as string) ?? "",
  };
}

function extractTextFromAdf(node: unknown): string {
  if (node === null || node === undefined) {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  const doc = node as Record<string, unknown>;

  if (doc.type === "text") {
    return (doc.text as string) ?? "";
  }

  const content = doc.content as unknown[] | undefined;
  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((child) => extractTextFromAdf(child))
    .join(doc.type === "paragraph" ? " " : "\n")
    .trim();
}
