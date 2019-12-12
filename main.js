import pkg from "./package.json"
import clear from "clear"
import minimist from "minimist"

import figlet from "figlet"
import chalk from "chalk"
import lolcat from "lolcatjs"
lolcat.options.seed = 744

const argv = minimist(process.argv.slice(2))

import github from "./src/github"
import { getHelp } from "./src/utils"
const oktokit = github.getInstance()

import {
  interactiveDownloadGist,
  interactiveOpenGist,
  interactiveCopyGistId,
  interactiveSearchGist,
  interactiveUpdateGist,
  openGist,
  listGists,
  searchGists
} from "./src/gist"

clear()

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

const getGist = async id => oktokit.gists.get({ gist_id: id })

const run = async () => {
  const token = github.getStoredGithubToken()

  if (!token || argv.token) {
    console.log(
      lolcat.fromString(
        figlet.textSync("Fond Of", {
          font: "ANSI Shadow",
          horizontalLayout: "full"
        })
      )
    )
  }

  if (argv.token) {
    github.setToken(argv.token)
    return
  }

  if (!token) {
    console.log(chalk.red.bold("Add your personal git access"))
    console.log("run gisti --token [token]")
    return
  }

  const { data: gists } = await getGists()

  if (argv.search) {
    let results = gists
    if (typeof argv.search !== "boolean") {
      results = searchGists(gists, argv.search)
      getFunction()(results)
      return
    }
    interactiveSearchGist(results, getFunction())
    return
  }

  if (argv.d || argv.download) {
    interactiveDownloadGist(gists)
    return
  }
  if (argv.l || argv.list) {
    listGists(gists)
    return
  }
  if (argv.c || argv.copy) {
    interactiveCopyGistId(gists)
    return
  }
  if (argv.o || argv.open) {
    const open = argv.o || argv.open
    if (typeof open !== "boolean") {
      const { data: gist } = await getGist(open)
      openGist(gist)
    } else {
      interactiveOpenGist(gists)
    }
    return
  }
  if ((argv.u || argv.update) && (argv.f || argv.file)) {
    const filePath = argv.f || argv.file
    interactiveUpdateGist(gists, filePath)
    //   console.log(file)

    //   if (file) {
    //     const { data: gists } = await getGists()
    //     const results = gists
    //     if (typeof update !== "boolean") {
    //       results = searchGists(gists, update)
    //     }
    //     console.log(results)
    //     //interactiveUpdateGist(result, file)
    //   }
  }

  if (argv.v || argv.version) {
    console.log(chalk.green.bold(`gisti ${pkg.version} 🚀`))
  }
  if (argv.h || argv.help) {
    console.log(getHelp())
  }
}

run()

const getFunction = () => {
  if (argv.d || argv.download) {
    return interactiveDownloadGist
  }
  if (argv.l || argv.list) {
    return listGists
  }

  if (argv.c || argv.copy) {
    return interactiveCopyGistId
  }
  if (argv.o || argv.open) {
    return interactiveOpenGist
  }

  return listGists
}
