import fs from 'fs'
import chalk from 'chalk'

import { getGistDownloadChoices, getRawFileChoices, getRawGistChoices } from './choices'
import { deleteGist, getGistsByQuery } from './api'
import {
  promptConfirmDelete,
  promptCopyGistId,
  promptDeleteGist,
  promptDownloadGist,
  promptOpenGist,
  promptSearchGist,
  promptUpdateGist,
} from './prompt'
import { downloadGist, downloadGistFile, openGist, addGistIdToClipboard } from './utils'

//------------------------------------------
export const interactiveSearchGist = async () => {
  const { searchString } = await promptSearchGist()
  const gists = await getGistsByQuery(searchString)
  return gists
}

export const interactiveDownloadGist = async (gists) => {
  const choices = await getGistDownloadChoices(gists)

  const { gistsToDownload } = await promptDownloadGist(choices)
  const promises = []
  for (const gist of gistsToDownload) {
    if (gist.id) {
      promises.push(downloadGist(gist))
    }
    if (gist.filename) {
      promises.push(downloadGistFile(gist))
    }
  }

  await Promise.all(promises)
  console.log(chalk.green.bold(`Download finished`))
}

export const interactiveOpenGist = async (gists) => {
  const choices = await getRawGistChoices(gists)

  const { gistToOpen } = await promptOpenGist(choices)
  openGist(gistToOpen)
}

export const interactiveCopyGistId = async (gists) => {
  const choices = await getRawGistChoices(gists)

  const { gistToCopy } = await promptCopyGistId(choices)
  addGistIdToClipboard(gistToCopy)
}

export const interactiveDeleteGist = async (gists) => {
  const choices = await getRawGistChoices(gists)

  const {
    gistToDelete: { id },
  } = await promptDeleteGist(choices)
  const { continueDelete } = await promptConfirmDelete()
  if (continueDelete) {
    deleteGist(id)
  }
}

export const interactiveUpdateGist = async (gists, filePath) => {
  fs.readFile(filePath, 'utf8', async (err, fileContent) => {
    const choices = await getRawFileChoices(gists)

    const { gistToUpdate } = await promptUpdateGist(choices)
    console.log(gistToUpdate, fileContent)
  })
}
