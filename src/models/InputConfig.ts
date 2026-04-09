export interface InputConfig {
  projectArchitecture: string;
  module?: string;
  jiraTaskId: string;
  bitbucketPullRequestUrl: string;
  mode?: "first" | "follow-up";
}
