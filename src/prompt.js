import inquirer from 'inquirer'
import { actionChoices, listChoices, listOwnerChoices } from './choices'

export const promptConfirmDelete = () => {
  const questions = [
    {
      name: 'continueDelete',
      type: 'confirm',
      message: 'Are you sure you want to delete this gist?',
      default: false,
    },
  ]
  return inquirer.prompt(questions)
}

export const promptAccessToken = () => {
  const question = [
    {
      name: 'token',
      type: 'input',
      message: 'Access Token:',
      validate: (value) => {
        if (value.length) {
          return true
        } else {
          return 'Please enter a token'
        }
      },
    },
  ]

  return inquirer.prompt(question)
}

export const promptGists = (gistPromptList) => {
  gistPromptList.forEach((output) => console.log(output))
}

export const promptDownloadGist = (choices) => {
  const question = [
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
  ]

  return inquirer.prompt(question)
}

export const promptOpenGist = (choices) => {
  const question = [
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
  ]

  return inquirer.prompt(question)
}

export const promptSearchGist = () => {
  const question = [
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
  ]

  return inquirer.prompt(question)
}

export const promptCopyGistId = async (choices) => {
  const question = [
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
  ]

  return inquirer.prompt(question)
}

export const promptUpdateGist = async (choices) => {
  const question = [
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
  ]

  return inquirer.prompt(question)
}

export const promptDeleteGist = async (choices) => {
  const question = [
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
  ]

  return inquirer.prompt(question)
}

export const promptListChoice = () => {
  const question = [
    {
      type: 'list',
      message: 'Select which gists you want to list',
      name: 'choice',
      default: listChoices[0],
      pageSize: listChoices.length,
      choices: listChoices,
    },
  ]

  return inquirer.prompt(question)
}

export const promptListOwnerChoice = () => {
  const question = [
    {
      type: 'list',
      message: 'Select which gists you want to list',
      name: 'choice',
      default: listOwnerChoices[0],
      pageSize: listOwnerChoices.length,
      choices: listOwnerChoices,
    },
  ]

  return inquirer.prompt(question)
}

export const promptActionChoice = () => {
  const question = [
    {
      type: 'list',
      message: 'Select a action for the results',
      name: 'choice',
      default: actionChoices[0],
      pageSize: actionChoices.length,
      choices: actionChoices,
    },
  ]

  return inquirer.prompt(question)
}
