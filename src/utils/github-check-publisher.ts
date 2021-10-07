import {Octokit} from 'octokit'
// eslint-disable-next-line node/no-extraneous-import
import {createAppAuth} from '@octokit/auth-app'

export interface GitHubCheckBasic {
  appId: string;
  installationId: string;
  privateKey: string;
  repoOwner: string;
  repoName: string;
  commit: string;
  detailsUrl?: string;
  checkStatus: string;
}

export interface GitHubCheck extends GitHubCheckBasic{
  checkName: string;
  conclusion: string;
  title: string;
  summary: string;
  annotations?: any[];
}

export default class GithubCheckPublisher {
  public async publish(check: GitHubCheck) {
    const createCheckRequest = {
      owner: check.repoOwner,
      repo: check.repoName,
      name: check.checkName,
      head_sha: check.commit,
      status: check.checkStatus,
      conclusion: check.conclusion,
      details_url: check.detailsUrl,
      output: {
        title: check.title,
        summary: check.summary,
        annotations: check.annotations,
      },
    }

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: check.appId,
        privateKey: check.privateKey,
        installationId: check.installationId,
      },
    })

    return octokit.rest.checks.create(createCheckRequest)
  }
}