import pkg from "./package.json"

import clear from "clear"
import chalk from "chalk"
import figlet from "figlet"
import minimist from "minimist"
import mdConsole from "consolemd"

const argv = minimist(process.argv.slice(2))

import github from "./lib/github"
import { getHelp } from "./lib"
const oktokit = github.getInstance()

import { downloadGist, openGist, listGists } from "./lib/gist"

clear()

if (!argv.v && !argv.version && !argv.help) {
  console.log(
    chalk.yellow(
      figlet.textSync("GISTI", {
        font: "ANSI Shadow",
        horizontalLayout: "full"
      })
    )
  )
}

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
    console.log(chalk.red.bold("Add your personal git access"))
    console.log("run gisti --token [token]")
    return
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
    //TODO: Search
  }
  if (argv.o || argv.open) {
    let { data: gists } = await getGists()
    openGist(gists)
  }
  if (argv.v || argv.version) {
    console.log(chalk.green.bold(`gist-cli ${pkg.version} 🚀`))
  }
  if (argv.h || argv.help) {
    mdConsole.log(getHelp())
  }
  if (argv.token) {
    github.setToken(argv.token)
  }
}

run()
