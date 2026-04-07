export interface InputConfig {
  projectArchitecture: string;
  jiraTaskId: string;
  bitbucketPullRequestUrl: string;
  mode?: "first" | "follow-up";
}
