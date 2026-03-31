export interface InputConfig {
  projectName: string;
  projectArchitecture: string;
  jiraTaskId: string;
  bitbucketPullRequestUrl: string;
  existingComments?: string[];
  mode?: "first" | "follow-up";
}
