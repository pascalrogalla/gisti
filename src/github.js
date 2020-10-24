import Configstore from 'configstore'
import { Octokit } from '@octokit/rest'

import pkg from '../package.json'

const conf = new Configstore(pkg.name, {}, { globalConfigPath: true })
let octokit

export default {
  setToken: (token) => {
    conf.set('github.token', token)
    console.log('Token successfully saved')
  },
  getInstance: () => {
    const auth = conf.get('github.token')
    octokit = new Octokit({
      auth,
    })
    return octokit
  },

  getStoredGithubToken: () => conf.get('github.token'),
}
