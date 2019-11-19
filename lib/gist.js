import inquirer from "inquirer"
import https from "https"
import fs from "fs"

import chalk from "chalk"

import github from "./github"

const conditionalAdd = (condition, item) => (condition ? [item] : [])

export const downloadGist = async () => {
  const oktokit = github.getInstance()
  const { data } = await oktokit.gists.list()
  const choices = data.reduce((map, gist) => {
    const fileList = Object.values(gist.files)

    const bla = [
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
    return [...map, ...bla]
  }, [])

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

const createFolderIfNotExist = path => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

const handleFileDownload = (file, path = process.cwd()) => {
  const fileStream = fs.createWriteStream(`${path}/${file.filename}`)

  return new Promise(resolve =>
    https.get(file.raw_url, function(response) {
      response.pipe(fileStream)
      console.log(chalk.green(`${file.filename} downloaded`))
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
