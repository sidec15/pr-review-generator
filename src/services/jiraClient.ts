import axios, { AxiosInstance } from "axios";

export function createJiraClient(): AxiosInstance {
  const cloudId = process.env.PR_REVIEW_GENERATOR_JIRA_CLOUD_ID;
  const email = process.env.PR_REVIEW_GENERATOR_JIRA_EMAIL;
  const token = process.env.PR_REVIEW_GENERATOR_JIRA_API_TOKEN;

  if (!cloudId || !email || !token) {
    throw new Error(
      "Missing Jira credentials. Please define PR_REVIEW_GENERATOR_JIRA_CLOUD_ID, PR_REVIEW_GENERATOR_JIRA_EMAIL, PR_REVIEW_GENERATOR_JIRA_API_TOKEN",
    );
  }

  return axios.create({
    baseURL: `https://api.atlassian.com/ex/jira/${cloudId}`,
    auth: {
      username: email,
      password: token,
    },
    headers: {
      Accept: "application/json",
    },
  });
}
