import inquirer from 'inquirer'
import https from 'https'
import fs from 'fs'
import opn from 'opn'
import chalk from 'chalk'
import clipboardy from 'clipboardy'

import { textMatchSearchWords } from './utils'

import {
  getGistDownloadChoices,
  getRawFileChoices,
  getRawGistChoices,
  getGistPromptList,
} from './choices'
import { deleteGist } from './api'
import { confirmDelete } from './inquirer'

export const interactiveDownloadGist = async (gists) => {
  const choices = await getGistDownloadChoices(gists)

  inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Choose gists or files to download',
        name: 'gistsToDownload',
        pageSize: choices.length,
        choices,
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must choose at least one gist or file.'
          }

          return true
        },
      },
    ])
    .then(({ gistsToDownload }) => {
      const promises = []
      for (const gist of gistsToDownload) {
        if (gist.id) {
          promises.push(downloadGist(gist))
        }
        if (gist.filename) {
          promises.push(downloadGistFile(gist))
        }
      }
      Promise.all(promises).then(() => console.log(chalk.green.bold(`Download finished`)))
    })
}

export const interactiveOpenGist = async (gists) => {
  const choices = await getRawGistChoices(gists)

  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select gist to open',
        name: 'gistToOpen',
        pageSize: choices.length,
        choices,
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must choose at least one gist or file.'
          }

          return true
        },
      },
    ])
    .then(({ gistToOpen }) => openGist(gistToOpen))
}

export const interactiveSearchGist = async (gists, listFunction) => {
  inquirer
    .prompt([
      {
        name: 'searchString',
        type: 'input',
        message: 'Search:',
        validate: (value) => {
          if (value.length) {
            return true
          } else {
            return 'Please enter a search'
          }
        },
      },
    ])
    .then(({ searchString }) => handleGistSearch(gists, searchString, listFunction))
}

export const interactiveCopyGistId = async (gists) => {
  const choices = await getRawGistChoices(gists)

  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select gist to copy',
        name: 'gistToCopy',
        pageSize: choices.length,
        choices,
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must choose at least one gist or file.'
          }

          return true
        },
      },
    ])
    .then(({ gistToCopy }) => copyGistId(gistToCopy))
}

const createFolderIfNotExist = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export const listGists = (gists, withFiles) => {
  const gistsPromptList = getGistPromptList(gists, withFiles)
  gistsPromptList.forEach((output) => console.log(output))
}

const downloadGistFile = (file, path = process.cwd()) => {
  const fileName = file.gistId ? `${file.gistId}_${file.filename}` : file.filename
  const fileStream = fs.createWriteStream(`${path}/${fileName}`)

  return new Promise((resolve) =>
    https.get(file.raw_url, (response) => {
      response.pipe(fileStream)
      console.log(chalk.green(`${fileName} downloaded`))
      resolve(file)
    })
  )
}

export const downloadGist = ({ id, files }) => {
  const path = `${process.cwd()}/${id}`
  createFolderIfNotExist(path)
  const fileList = Object.values(files)
  const promises = []
  for (const file of fileList) {
    promises.push(downloadGistFile(file, path))
  }
  return Promise.all(promises)
}

const handleGistSearch = (gists, search, listFunction) => {
  const results = searchGists(gists, search)
  listFunction(results)
}

export const searchGists = (gists, searchString) =>
  gists.filter(({ id, description }) =>
    textMatchSearchWords(`${id} ${description}`, searchString.split(' '))
  )

export const interactiveUpdateGist = async (gists, filePath) => {
  fs.readFile(filePath, 'utf8', async (err, fileContent) => {
    const choices = await getRawFileChoices(gists)

    inquirer
      .prompt([
        {
          type: 'list',
          message: 'Select gist to update',
          name: 'gistToUpdate',
          pageSize: choices.length > 20 ? choices.length : 20,
          choices,
          validate: (answer) => {
            if (answer.length !== 1) {
              return 'You must choose one file.'
            }

            return true
          },
        },
      ])
      .then(({ gistToUpdate }) => updateGist(gistToUpdate, fileContent))
  })
}

export const interactiveDeleteGist = async (gists) => {
  const choices = await getRawGistChoices(gists)

  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Select gist to delete',
        name: 'gistToDelete',
        pageSize: choices.length,
        choices,
        validate: (answer) => {
          if (answer.length !== 1) {
            return 'You must choose one gist.'
          }

          return true
        },
      },
    ])
    .then(({ gistToDelete: { id } }) => {
      confirmDelete().then(({ continueDelete }) => {
        if (continueDelete) {
          deleteGist(id)
        }
      })
    })
}

export const updateGist = ({ gistId, filename }, fileContent) => {
  console.log(gistId, filename, fileContent)
}

export const openGist = async ({ html_url: url }) => {
  opn(url)
}

const copyGistId = ({ id }) => {
  clipboardy.write(id)
}
