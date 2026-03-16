import { AxiosInstance } from "axios";
import { PullRequestInfo } from "../models/PullRequest";
import { parseBitbucketPrUrl } from "../utils/bitbucketUrlParser";
import { createBitbucketClient } from "./bitbucketClient";

export class BitbucketService {
  private client: AxiosInstance;

  constructor() {
    this.client = createBitbucketClient();
  }

  async getPullRequestInfo(prUrl: string): Promise<PullRequestInfo> {
    const parsed = parseBitbucketPrUrl(prUrl);

    const response = await this.client.get(
      `/repositories/${parsed.workspace}/${parsed.repoSlug}/pullrequests/${parsed.pullRequestId}`,
    );

    const pr = response.data;

    return {
      id: parsed.pullRequestId,
      title: pr.title,
      description: pr.description || "",
      sourceBranch: pr.source.branch.name,
      targetBranch: pr.destination.branch.name,
      workspace: parsed.workspace,
      repoSlug: parsed.repoSlug,
    };
  }

  async getPullRequestDiff(prUrl: string): Promise<string> {
    const parsed = parseBitbucketPrUrl(prUrl);

    const response = await this.client.get(
      `/repositories/${parsed.workspace}/${parsed.repoSlug}/pullrequests/${parsed.pullRequestId}/diff`,
      {
        responseType: "text",
      },
    );

    return response.data;
  }
}
