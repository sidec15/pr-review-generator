# pr-review-generator

CLI tool that generates a structured code review prompt and PR diff by pulling data from **Jira** and **Bitbucket**. The output is ready to be fed into an AI assistant for automated code review.

## What it does

1. Fetches pull request metadata, diff, and comments from Bitbucket
2. Fetches the linked Jira issue summary and description
3. Fills a review prompt template with all the collected context
4. Outputs two files: a review prompt markdown and the raw PR diff

## Prerequisites

- **Node.js** >= 18.3
- A **Bitbucket** API token with `read:pullrequest:bitbucket` and `read:repository:bitbucket` scopes
- A **Jira** API token with `read:jira-user` and `read:jira-work` scopes
- Your Jira Cloud ID (check how to find it in the [Jira documentation](https://support.atlassian.com/jira/kb/retrieve-my-atlassian-sites-cloud-id/))

## Installation

```bash
git clone <repository-url>
cd pr-review-generator
npm install
npm run build
npm install -g .
```

After this, `pr-review-generator` is available globally.

For development without global install:

```bash
npm run dev -- -i input.json
```

## Configuration

Set the following environment variables on your machine (user or system level):

| Variable                                  | Description                |
| ----------------------------------------- | -------------------------- |
| `PR_REVIEW_GENERATOR_BITBUCKET_USERNAME`  | Bitbucket username (email) |
| `PR_REVIEW_GENERATOR_BITBUCKET_API_TOKEN` | Bitbucket API token        |
| `PR_REVIEW_GENERATOR_JIRA_CLOUD_ID`       | Jira Cloud instance ID     |
| `PR_REVIEW_GENERATOR_JIRA_EMAIL`          | Jira account email         |
| `PR_REVIEW_GENERATOR_JIRA_API_TOKEN`      | Jira API token             |

Alternatively, you can create a `.env` file in the directory where you run the command:

```env
PR_REVIEW_GENERATOR_BITBUCKET_USERNAME=john.doe@company.com
PR_REVIEW_GENERATOR_BITBUCKET_API_TOKEN=your-bitbucket-api-token
PR_REVIEW_GENERATOR_JIRA_CLOUD_ID=cc7ed9a2-182f-4bd3-83fc-0ba6e1e672ca
PR_REVIEW_GENERATOR_JIRA_EMAIL=john.doe@company.com
PR_REVIEW_GENERATOR_JIRA_API_TOKEN=your-jira-api-token
```

## Input file

The tool reads a JSON configuration file describing the PR to review.

| Field                     | Type     | Required | Description                               |
| ------------------------- | -------- | -------- | ----------------------------------------- |
| `projectName`             | string   | yes      | Name of the project                       |
| `projectArchitecture`     | string   | yes      | Technology stack (e.g. `.NET`, `Node.js`) |
| `jiraTaskId`              | string   | yes      | Jira issue key (e.g. `SP-12565`)          |
| `bitbucketPullRequestUrl` | string   | yes      | Full Bitbucket PR URL                     |
| `existingComments`        | string[] | no       | Additional reviewer comments to include   |

Example `input.json`:

```json
{
  "projectName": "pooling",
  "projectArchitecture": ".NET",
  "jiraTaskId": "SP-12565",
  "bitbucketPullRequestUrl": "https://bitbucket.org/movesion/mpooling-backend/pull-requests/231",
  "existingComments": ["Check if the retry logic handles timeout correctly"]
}
```

## Usage

```
pr-review-generator [options]

Options:
  -i, --input <path>   Path to the input JSON file (default: input.json)
  -o, --output <dir>   Output directory for generated files (default: input file directory)
  -h, --help           Show help message
```

### Examples

Run with defaults (reads `input.json` in current directory, outputs next to it):

```bash
pr-review-generator
```

Specify input file and output directory:

```bash
pr-review-generator -i reviews/my-pr.json -o output/
```

Show help:

```bash
pr-review-generator -h
```

## Output

The tool generates two files in the output directory:

| File                            | Description                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| `{jiraTaskId}-review-prompt.md` | Filled review prompt with Jira context, PR description, comments, and review instructions |
| `{jiraTaskId}-pr.diff`          | Raw PR diff                                                                               |

For example, with `jiraTaskId: "SP-12565"` the output is:

- `SP-12565-review-prompt.md`
- `SP-12565-pr.diff`

Feed both files to an AI assistant to get a structured code review.

## Standalone executables

You can build standalone executables that don't require Node.js:

```bash
npm run package
```

This produces binaries in the `bin/` folder for Windows, Linux, and macOS (x64 + ARM64).

### GitHub Releases

Pre-built executables are published automatically via GitHub Actions when you push a version tag. **Do not create releases manually** — the workflow handles release creation and artifact upload.

```bash
git tag v1.0.0
git push --tags
```

Download the binary for your platform from the [Releases](../../releases) page and run it directly.
