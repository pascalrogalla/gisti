import inquirer from 'inquirer'
import chalk from 'chalk'
import { conditionalAdd } from './utils'

export const getGistDownloadChoices = async (gists) => {
  const gistFileList = gists.reduce((map, gist) => {
    const fileList = Object.values(gist.files)

    const newGists = [
      new inquirer.Separator(
        chalk.rgb(184, 190, 202).bold(`${gist.description} - files: ${fileList.length}`)
      ),
      ...conditionalAdd(fileList.length > 1, {
        name: chalk.rgb(0, 160, 200).bold(gist.id),
        value: gist,
      }),
      ...fileList.map((file) => ({
        name: `${file.filename}`,
        value: { ...file, gistId: gist.id },
      })),
    ]
    return [...map, ...newGists]
  }, [])

  return gistFileList
}

export const getRawFileChoices = async (gists) => {
  const gistFileList = gists.reduce((map, gist) => {
    const fileList = Object.values(gist.files)

    const newGists = [
      new inquirer.Separator(chalk.rgb(184, 190, 202).bold(`${gist.id} - ${gist.description}`)),
      ...fileList.map((file) => ({
        name: `${file.filename}`,
        value: { ...file, gistId: gist.id },
      })),
    ]
    return [...map, ...newGists]
  }, [])

  return gistFileList
}

export const getRawGistChoices = async (gists) => {
  const gistList = gists.reduce((map, gist) => {
    const newGists = [
      {
        name: `${chalk.rgb(184, 190, 202).bold(gist.id)} - ${gist.description}`,
        value: gist,
      },
    ]
    return [...map, ...newGists]
  }, [])

  return gistList
}
