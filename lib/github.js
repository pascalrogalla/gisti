const CLI = require("clui")
const Configstore = require("configstore")
const Octokit = require("@octokit/rest")
const Spinner = CLI.Spinner

const inquirer = require("./inquirer")
const pkg = require("../package.json")

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

  getStoredGithubToken: () => {
    return conf.get("github.token")
  },

  setGithubCredentials: async () => {
    const credentials = await inquirer.askGithubCredentials()
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

    try {
      const response = await octokit.oauthAuthorizations.createAuthorization({
        scopes: ["gist"],
        note: "gist-cli, the command-line tool for gists"
      })
      const token = response.data.token
      if (token) {
        conf.set("github.token", token)
        return token
      } else {
        throw new Error(
          "Missing Token",
          "GitHub token was not found in the response"
        )
      }
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  }
}
