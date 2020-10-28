import https from 'https'
import fs from 'fs'
import chalk from 'chalk'
import figlet from 'figlet'
import lolcat from 'lolcatjs'

import opn from 'opn'
import clipboardy from 'clipboardy'

import github from './github'

export const textMatchSearchWords = (text, searchTermWords) =>
  searchTermWords.every((term) => text.match(new RegExp(term, 'i')))

export const executeIfAuthorized = (action) => {
  const authorized = !!github.getStoredGithubToken()
  if (authorized) {
    action()
  } else {
    printHeader()
    console.log(chalk.red.bold('Set your personal github access token'))
    console.log(
      `run ${chalk.rgb(0, 160, 200).bold('gisti auth')} or ${chalk
        .rgb(0, 160, 200)
        .bold('gisti auth --token <token>')}`
    )
  }
}

export const executeIfNotAuthorized = (action) => {
  const authorized = !!github.getStoredGithubToken()
  if (!authorized) {
    action()
  }
}

const printHeader = () => {
  lolcat.fromString(
    figlet.textSync('GISTI', {
      font: 'ANSI Shadow',
      horizontalLayout: 'full',
    })
  )
}

export const conditionalAdd = (condition, item) => (condition ? [item] : [])

const createFolderIfNotExist = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export const downloadGistFile = (file, path = process.cwd()) => {
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

export const openGist = async ({ html_url: url }) => {
  opn(url)
}

export const addGistIdToClipboard = ({ id }) => {
  clipboardy.write(id)
}

export const listGists = (gists, withFiles) => {
  const gistsPromptList = getGistPromptList(gists, withFiles)
  gistsPromptList.forEach((output) => console.log(output))
}

const getGistPromptList = (gists, withFiles = false) =>
  gists.reduce((map, gist) => {
    const fileList = Object.values(gist.files)
    const bla = [
      chalk
        .rgb(184, 190, 202)
        .bold(
          `${gist.id} - ${gist.description} - Files:${fileList.length}${
            gist.public ? '' : chalk.rgb(236, 98, 113)(' [Private]')
          }`
        ),
      ...conditionalAdd(withFiles, ...fileList.map((file) => `- ${file.filename}`)),
    ]
    return [...map, ...bla]
  }, [])

export const getFileContents = (filePaths) =>
  filePaths.reduce((files, path) => {
    const parts = path.split('/')
    const filename = parts[parts.length - 1]
    const content = fs.readFileSync(path, 'utf8')
    return { ...files, [filename]: { content } }
  }, {})

export const output = {
  PUBLIC: 1,
  PRIVATE: 2,
  STARRED: 4,
}

export const getListOptions = ({ isStarred, isPrivate, isPublic, isAll, isOwn }) => {
  let option = false

  if (isPublic) {
    option = option | output.PUBLIC
  }
  if (isPrivate) {
    option = option | output.PRIVATE
  }
  if (isOwn) {
    option = option | output.PUBLIC | output.PRIVATE
  }
  if (isStarred) {
    option = option | output.STARRED
  }
  if (isAll) {
    option = option | output.PUBLIC | output.PRIVATE | output.STARRED
  }

  return option
}
