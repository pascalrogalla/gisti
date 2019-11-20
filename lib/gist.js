import inquirer from "inquirer"
import https from "https"
import fs from "fs"
import opn from "opn"

import chalk from "chalk"

import github from "./github"

const conditionalAdd = (condition, item) => (condition ? [item] : [])

const getGistFileList = async () => {
  const oktokit = github.getInstance()
  const { data } = await oktokit.gists.list()
  const gistFileList = data.reduce((map, gist) => {
    const fileList = Object.values(gist.files)

    const newGists = [
      new inquirer.Separator(
        chalk
          .rgb(184, 190, 202)
          .bold(`${gist.description} - files: ${fileList.length}`)
      ),
      ...conditionalAdd(fileList.length > 1, {
        name: chalk.blueBright.bold(gist.id),
        value: gist
      }),
      ...fileList.map(file => ({
        name: `${file.filename}`,
        value: { ...file, gistId: gist.id }
      }))
    ]
    return [...map, ...newGists]
  }, [])

  return gistFileList
}

const getGistList = async () => {
  const oktokit = github.getInstance()
  const { data } = await oktokit.gists.list()
  const gistList = data.reduce((map, gist) => {
    const fileList = Object.values(gist.files)

    const newGists = [
      {
        name: `${chalk.rgb(184, 190, 202).bold(gist.id)} - ${gist.description}`,
        value: gist
      }
    ]
    return [...map, ...newGists]
  }, [])

  return gistList
}

export const downloadGist = async () => {
  const choices = await getGistFileList()

  inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Select gist or file to download",
        name: "gistsToDownload",
        pageSize: choices.length,
        choices,
        validate: function(answer) {
          if (answer.length < 1) {
            return "You must choose at least one gist or file."
          }

          return true
        }
      }
    ])
    .then(({ gistsToDownload }) => {
      const promises = []
      for (const gist of gistsToDownload) {
        if (gist.id) {
          promises.push(handleGistDownload(gist))
        }
        if (gist.filename) {
          promises.push(handleFileDownload(gist))
        }
      }
      Promise.all(promises).then(() =>
        console.log(chalk.green.bold(`Download finished`))
      )
    })
}

export const openGist = async () => {
  const choices = await getGistList()

  inquirer
    .prompt([
      {
        type: "list",
        message: "Select gist or file to download",
        name: "gistToOpen",
        pageSize: choices.length,
        choices,
        validate: function(answer) {
          if (answer.length < 1) {
            return "You must choose at least one gist or file."
          }

          return true
        }
      }
    ])
    .then(({ gistToOpen: { html_url: url } }) => {
      opn(url)
    })
}

const createFolderIfNotExist = path => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

const handleFileDownload = (file, path = process.cwd()) => {
  const fileName = file.gistId
    ? `${file.gistId}_${file.filename}`
    : file.filename
  const fileStream = fs.createWriteStream(`${path}/${fileName}`)

  return new Promise(resolve =>
    https.get(file.raw_url, function(response) {
      response.pipe(fileStream)
      console.log(chalk.green(`${fileName} downloaded`))
      resolve(file)
    })
  )
}

const handleGistDownload = ({ id, files }) => {
  const path = `${process.cwd()}/${id}`
  createFolderIfNotExist(path)
  const fileList = Object.values(files)
  const promises = []
  for (const file of fileList) {
    promises.push(handleFileDownload(file, path))
  }
  return Promise.all(promises)
}

export const listOwnGists = async () => {
  const oktokit = github.getInstance()
  const { data } = await oktokit.gists.list()
  listGists(data)
}

export const listStarredGists = async () => {
  const oktokit = github.getInstance()
  const { data } = await oktokit.gists.listStarred()
  listGists(data)
}

export const listPrivateGists = async () => {
  const oktokit = github.getInstance()
  const { data } = await oktokit.gists.list()
  const privateGists = data.filter(({ public: p }) => p === false)
  listGists(privateGists)
}

const listGists = data => {
  const gists = data.reduce((map, gist) => {
    const fileList = Object.values(gist.files)

    const bla = [
      chalk
        .rgb(184, 190, 202)
        .bold(`${gist.id} - ${gist.description} - Files:${fileList.length}`),
      ...fileList.map(file => `- ${file.filename}`)
    ]
    return [...map, ...bla]
  }, [])

  gists.forEach(output => console.log(output))
}
