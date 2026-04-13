# pr-review-generator

CLI tool that generates a structured code review prompt and PR diff by pulling data from **Jira** and **Bitbucket**. The output is ready to be fed into an AI assistant for automated code review.

## What it does

1. Fetches pull request metadata, diff, and comments from Bitbucket
2. Fetches the linked Jira issue summary and description
3. Fills a review prompt template with all the collected context
4. Outputs two files: a review prompt markdown and the raw PR diff

## Prerequisites

- A **Bitbucket** API token with `read:pullrequest:bitbucket` and `read:repository:bitbucket` scopes
- A **Jira** API token with `read:jira-user` and `read:jira-work` scopes
- Your Jira Cloud ID (check how to find it in the [Jira documentation](https://support.atlassian.com/jira/kb/retrieve-my-atlassian-sites-cloud-id/))
- **Node.js** >= 18.3 — only needed if you [install from source](#from-source) or use [local development](#local-development). The [pre-built releases](#from-github-releases) run without Node.js.

## Installation

### From GitHub Releases

This is the simplest way to use the tool: download a standalone executable from [Releases](../../releases) — no Node.js installation required.

Each release includes binaries built for:

| Platform        | Download |
| --------------- | -------- |
| Windows (x64)   | `pr-review-generator-win-x64.exe` |
| Linux (x64)     | `pr-review-generator-linux-x64` |
| macOS (Intel)   | `pr-review-generator-macos-x64` |
| macOS (Apple Silicon) | `pr-review-generator-macos-arm64` |

After downloading:

- **Windows:** run `pr-review-generator-win-x64.exe` (rename or add its folder to your `PATH` if you want to invoke `pr-review-generator` from anywhere).
- **Linux / macOS:** make the file executable, then run it (optionally move it to a directory on your `PATH` and name it `pr-review-generator`):

```bash
chmod +x pr-review-generator-macos-arm64
./pr-review-generator-macos-arm64 --help
```

### From source

```bash
git clone <repository-url>
cd pr-review-generator
npm install
npm run build
npm install -g .
```

After this, `pr-review-generator` is available globally.

### Local development

Run without a global install:

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
| `projectArchitecture`     | string   | yes      | Technology stack (e.g. `.NET`, `Node.js`) |
| `jiraTaskId`              | string   | yes      | Jira issue key (e.g. `SP-12565`)          |
| `bitbucketPullRequestUrl` | string   | yes      | Full Bitbucket PR URL                     |
| `mode`                    | string   | no       | Review mode: `"first"` (default) or `"follow-up"` |
| `module`                  | string   | no       | Business module the PR targets (e.g. `survey`, `carpooling`, `wallet`). When set, the prompt asks the AI to apply the module-specific rules from attached resources. |

Example `input.json`:

```json
{
  "projectArchitecture": ".NET",
  "module": "carpooling",
  "jiraTaskId": "SP-12565",
  "bitbucketPullRequestUrl": "https://bitbucket.org/movesion/mpooling-backend/pull-requests/231",
  "mode": "first"
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

## Building standalone binaries locally

To produce the same kind of executables as in [Releases](../../releases) on your machine:

```bash
npm run package
```

Artifacts are written to `bin/` for Windows, Linux, and macOS (x64 + ARM64).

### Publishing a release

Pre-built executables are published automatically via GitHub Actions when you push a version tag. **Do not create releases manually** — the workflow creates the release and uploads the binaries.

```bash
git tag v1.0.0
git push --tags
```
