import { Spinner } from "clui"
import Configstore from "configstore"
import Octokit from "@octokit/rest"

import { askGithubCredentials } from "./inquirer"
import pkg from "../package.json"

const conf = new Configstore(pkg.name, {}, { globalConfigPath: true })
let octokit

export default {
  setToken: token => conf.set("github.token", token),
  getInstance: () => {
    const auth = conf.get("github.token")
    octokit = new Octokit({
      auth
    })
    return octokit
  },

  getStoredGithubToken: () => conf.get("github.token"),
  setGithubCredentials: async () => {
    const credentials = await askGithubCredentials()
    octokit = new Octokit({
      auth: {
        username: credentials.username,
        password: credentials.password
      }
    })
  },

  registerNewToken: async () => {
    const status = new Spinner("Authenticating you, please wait...")
    status.start()

    const response = await octokit.oauthAuthorizations.createAuthorization({
      scopes: ["gist"],
      note: "gisti, the command-line tool for gists"
    })
    const { token } = response.data
    if (token) {
      conf.set("github.token", token)
      status.stop()
      return token
    } else {
      status.stop()
      throw new Error(
        "Missing Token",
        "GitHub token was not found in the response"
      )
    }
  }
}
