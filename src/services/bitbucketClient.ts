import axios, { AxiosInstance } from "axios";

export function createBitbucketClient(): AxiosInstance {
  const username = process.env.BITBUCKET_USERNAME;
  const token = process.env.BITBUCKET_API_TOKEN;

  if (!username || !token) {
    throw new Error(
      "Missing Bitbucket credentials. Please define BITBUCKET_USERNAME and BITBUCKET_API_TOKEN",
    );
  }

  return axios.create({
    baseURL: "https://api.bitbucket.org/2.0",
    auth: {
      username,
      password: token,
    },
    headers: {
      Accept: "application/json",
    },
  });
}
