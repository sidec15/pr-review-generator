import { AxiosInstance } from "axios";
import { PrComment } from "../models/PrComment";
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
        beforeRedirect: (options: Record<string, unknown>) => {
          const auth = this.client.defaults.auth as
            | { username: string; password: string }
            | undefined;
          if (auth) {
            const encoded = Buffer.from(
              `${auth.username}:${auth.password}`,
            ).toString("base64");
            (options.headers as Record<string, string>).Authorization =
              `Basic ${encoded}`;
          }
        },
      },
    );

    return response.data;
  }

  async getPullRequestComments(prUrl: string): Promise<PrComment[]> {
    const parsed = parseBitbucketPrUrl(prUrl);
    const basePath = `/repositories/${parsed.workspace}/${parsed.repoSlug}/pullrequests/${parsed.pullRequestId}/comments`;

    const comments: PrComment[] = [];
    let nextUrl: string | null = basePath;

    while (nextUrl) {
      const response: { data: { values?: unknown[]; next?: string } } =
        await this.client.get(nextUrl);
      const values = response.data.values ?? [];

      for (const item of values) {
        const comment = item as Record<string, unknown>;
        const user = comment.user as Record<string, unknown> | undefined;
        const content = comment.content as Record<string, unknown> | undefined;
        const inline = comment.inline as Record<string, unknown> | undefined;

        comments.push({
          author: (user?.display_name as string) ?? "Unknown",
          content: (content?.raw as string) ?? "",
          createdOn: (comment.created_on as string) ?? "",
          isInline: inline !== undefined && inline !== null,
          filePath: inline?.path as string | undefined,
          line: (inline?.to as number) ?? (inline?.from as number),
        });
      }

      nextUrl = response.data.next ?? null;
    }

    return comments;
  }
}
