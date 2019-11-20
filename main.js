import clear from "clear"
import chalk from "chalk"
import figlet from "figlet"
import minimist from "minimist"
const argv = minimist(process.argv.slice(2))

import github from "./lib/github"

import {
  downloadGist,
  listOwnGists,
  listPrivateGists,
  listStarredGists,
  openGist
} from "./lib/gist"

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
    if (argv.s || argv.starred) {
      listStarredGists()
    } else if (argv.p || argv.private) {
      listPrivateGists()
    } else {
      listOwnGists()
    }
  }
  if (argv.o || argv.open) {
    openGist()
  }
}

run()
