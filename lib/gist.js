import inquirer from "inquirer"
import https from "https"
import fs from "fs"
import opn from "opn"
import chalk from "chalk"
import clipboardy from "clipboardy"

import { textMatchSearchWords } from "./utils"

const conditionalAdd = (condition, item) => (condition ? [item] : [])

const getGistDownloadChoices = async gists => {
  const gistFileList = gists.reduce((map, gist) => {
    const fileList = Object.values(gist.files)

    const newGists = [
      new inquirer.Separator(
        chalk
          .rgb(184, 190, 202)
          .bold(`${gist.description} - files: ${fileList.length}`)
      ),
      ...conditionalAdd(fileList.length > 1, {
        name: chalk.rgb(0, 160, 200).bold(gist.id),
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

const getRawGistChoices = async gists => {
  const gistList = gists.reduce((map, gist) => {
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

const getGistPromptList = gists =>
  gists.reduce((map, gist) => {
    const fileList = Object.values(gist.files)

    const bla = [
      chalk
        .rgb(184, 190, 202)
        .bold(`${gist.id} - ${gist.description} - Files:${fileList.length}`),
      ...fileList.map(file => `- ${file.filename}`)
    ]
    return [...map, ...bla]
  }, [])

export const interactiveDownloadGist = async gists => {
  const choices = await getGistDownloadChoices(gists)

  inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Choose gists or files to download",
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

export const interactiveOpenGist = async gists => {
  const choices = await getRawGistChoices(gists)

  inquirer
    .prompt([
      {
        type: "list",
        message: "Select gist to open",
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
    .then(({ gistToOpen }) => handleOpenGist(gistToOpen))
}

export const interactiveSearchGist = async (gists, listFunction) => {
  inquirer
    .prompt([
      {
        name: "searchString",
        type: "input",
        message: "Search:",
        validate: function(value) {
          if (value.length) {
            return true
          } else {
            return "Please enter a search"
          }
        }
      }
    ])
    .then(({ searchString }) =>
      handleGistSearch(gists, searchString, listFunction)
    )
}

export const interactiveCopyGistId = async gists => {
  const choices = await getRawGistChoices(gists)

  inquirer
    .prompt([
      {
        type: "list",
        message: "Select gist to open",
        name: "gistToCopy",
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
    .then(({ gistToCopy }) => handleCopyGistId(gistToCopy))
}

export const openGist = async gist => {
  handleOpenGist(gist)
}

const createFolderIfNotExist = path => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export const listGists = gists => {
  const gistsPromptList = getGistPromptList(gists)

  gistsPromptList.forEach(output => console.log(output))
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

const handleOpenGist = ({ html_url: url }) => {
  opn(url)
}

const handleCopyGistId = ({ id }) => {
  clipboardy.write(id)
}

const handleGistSearch = (gists, search, listFunction) => {
  const results = searchGists(gists, search)
  listFunction(results)
}

export const searchGists = (gists, searchString) =>
  gists.filter(({ id, description }) =>
    textMatchSearchWords(`${id} ${description}`, searchString.split(" "))
  )
