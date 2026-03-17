import axios, { AxiosInstance } from "axios";

export function createJiraClient(): AxiosInstance {
  const baseUrl = process.env.PR_REVIEW_GENERATOR_JIRA_BASE_URL;
  const email = process.env.PR_REVIEW_GENERATOR_JIRA_EMAIL;
  const token = process.env.PR_REVIEW_GENERATOR_JIRA_API_TOKEN;

  if (!baseUrl || !email || !token) {
    throw new Error(
      "Missing Jira credentials. Please define PR_REVIEW_GENERATOR_JIRA_BASE_URL, PR_REVIEW_GENERATOR_JIRA_EMAIL, PR_REVIEW_GENERATOR_JIRA_API_TOKEN",
    );
  }

  return axios.create({
    baseURL: baseUrl,
    auth: {
      username: email,
      password: token,
    },
    headers: {
      Accept: "application/json",
    },
  });
}
