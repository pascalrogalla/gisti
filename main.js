import clear from "clear"
import chalk from "chalk"
import figlet from "figlet"
import minimist from "minimist"
const argv = minimist(process.argv.slice(2))

import github from "./lib/github"

import { downloadGist, listOwnGists, listStarredGists } from "./lib/gist"

clear()

console.log(
  chalk.yellow(figlet.textSync("GIST CLI", { horizontalLayout: "full" }))
)

const run = async () => {
  let token = github.getStoredGithubToken()
  if (!token) {
    await github.setGithubCredentials()
    token = await github.registerNewToken()
  }

  if (argv.d || argv.download) {
    downloadGist()
  }
  if (argv.l || argv.list) {
    listOwnGists()
  }
  if (argv.s || argv.starred) {
    listStarredGists()
  }
}

run()
