export interface ParsedBitbucketUrl {
  workspace: string;
  repoSlug: string;
  pullRequestId: string;
}

export function parseBitbucketPrUrl(url: string): ParsedBitbucketUrl {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`Invalid Bitbucket URL: ${url}`);
  }

  if (!parsedUrl.hostname.includes("bitbucket.org")) {
    throw new Error(`URL is not a Bitbucket URL: ${url}`);
  }

  const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

  /**
   * Expected structure:
   *
   * /workspace/repo/pull-requests/123
   */

  if (pathParts.length < 4) {
    throw new Error(`Invalid Bitbucket PR URL structure: ${url}`);
  }

  const [workspace, repoSlug, pullRequestsSegment, prId] = pathParts;

  if (pullRequestsSegment !== "pull-requests") {
    throw new Error(`URL is not a Pull Request URL: ${url}`);
  }

  if (!prId) {
    throw new Error(`Missing PR id in URL: ${url}`);
  }

  return {
    workspace,
    repoSlug,
    pullRequestId: prId,
  };
}
