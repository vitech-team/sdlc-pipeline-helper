import {Command, flags} from '@oclif/command'
import {Sarif} from '../utils/sarif/sarif'
import * as cf from '../utils/common-flags'

export default class SarifPublish extends Command {
  static description = 'Convert SARIF report into markdown format and publish it as Quality Check'

  static flags = {
    ...cf.commonFlags,

    sourceRoot: flags.string(
      {
        description: 'sourceRoot DIR',
        required: true,
      },
    ),

  }

  async run() {
    const {flags} = this.parse(SarifPublish)
    const appId = flags.appId || process.env.GH_APP_ID
    const privateKey = flags.privateKey || process.env.GH_APP_PRIVATE_KEY
    const installationId = flags.installationId || process.env.GH_APP_INSTALLATION_ID

    const sarif = new Sarif()
    await sarif.publishAsCheck({
      appId: this.requiredVar(appId, 'appId flag or GH_APP_ID environment variable is required'),
      privateKey: this.requiredVar(privateKey, 'privateKey flag or GH_APP_PRIVATE_KEY environment variable is required'),
      installationId: this.requiredVar(installationId, 'installationId flag or GH_APP_INSTALLATION_ID environment variable is required'),
      commit: flags.commit,
      repoOwner: flags.repoOwner,
      repoName: flags.repoName,
      checkStatus: flags.checkStatus,
      sourceRoot: flags.sourceRoot,
    })
  }

  requiredVar(value: string | undefined, error: string): string {
    if (value === undefined || value.length === 0) {
      throw new Error(error)
    }
    return value
  }
}