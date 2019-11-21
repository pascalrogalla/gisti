import clear from "clear"
import chalk from "chalk"
import figlet from "figlet"
import minimist from "minimist"
const argv = minimist(process.argv.slice(2))

import github from "./lib/github"
const oktokit = github.getInstance()

import { downloadGist, openGist, listGists } from "./lib/gist"

clear()

console.log(
  chalk.yellow(
    figlet.textSync("GIST CLI", {
      font: "ANSI Shadow",
      horizontalLayout: "full"
    })
  )
)

const getGists = async () => {
  if (argv.s || argv.starred) {
    return oktokit.gists.listStarred()
  } else if (argv.p || argv.private) {
    const { data } = await oktokit.gists.list()
    return Promise.resolve({
      data: data.filter(({ public: p }) => p === false)
    })
  } else {
    return oktokit.gists.list()
  }
}

const run = async () => {
  let token = github.getStoredGithubToken()
  if (!token) {
    await github.setGithubCredentials()
    token = await github.registerNewToken()
  }

  if (argv.d || argv.download) {
    let { data: gists } = await getGists()
    downloadGist(gists)
  }
  if (argv.l || argv.list) {
    let { data: gists } = await getGists()
    listGists(gists)
  }
  if (argv.search) {
    //search
  }
  if (argv.o || argv.open) {
    let { data: gists } = await getGists()
    openGist(gists)
  }
}

run()
