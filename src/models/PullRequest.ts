export interface PullRequestInfo {
  id: string;
  title: string;
  description: string;
  sourceBranch: string;
  targetBranch: string;
  workspace: string;
  repoSlug: string;
}
