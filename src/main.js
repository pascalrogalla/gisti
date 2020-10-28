import pkg from '../package.json'
import program from 'commander'

import terminalLink from 'terminal-link'

import lolcat from 'lolcatjs'
lolcat.options.seed = 744

import github from './github'

import {
  interactiveDownloadGist,
  interactiveOpenGist,
  interactiveCopyGistId,
  interactiveSearchGist,
  interactiveDeleteGist,
} from './interactiveHandler'

import {
  createGist,
  getGist,
  getPrivateOrStarredGists,
  getGistsByQuery,
  deleteGist,
  getGistsByOptions,
} from './api'

import {
  executeIfAuthorized,
  openGist,
  listGists,
  downloadGist,
  getFileContents,
  getOptions,
} from './utils'
import { promptConfirmDelete, promptAccessToken, promptListChoice } from './prompt'
import chalk from 'chalk'

const openGistById = async (id) => {
  const { data: gist } = await getGist(id)
  openGist(gist)
  return Promise.resolve()
}

const getFunction = ({ list, copy, open, download }) => {
  if (download) {
    return interactiveDownloadGist
  }
  if (list) {
    return listGists
  }
  if (copy) {
    return interactiveCopyGistId
  }
  if (open) {
    return interactiveOpenGist
  }

  return listGists
}

program.name('gisti').description('GISTI - The interactive CLI for gist').version(pkg.version)

program
  .command('auth [token]')
  .description('Sets/Updates the personal access token')
  .option('-t, --token <token>', 'Set token')
  .action(async (token, { token: optToken }) => {
    token = token || optToken
    if (token) {
      github.setToken(token)
    } else {
      const link = terminalLink(
        'https://github.com/settings/tokens',
        'https://github.com/settings/tokens/new?description=GISTI&scopes=gist',
        { fallback: (text) => text }
      )
      console.log(`Create a new personal access token at: ${chalk.rgb(0, 160, 200).bold(link)}`)
      const { token } = await promptAccessToken()
      github.setToken(token)
    }
  })

program
  .command('list')
  .description('Lists your gists')
  .option('-a, --all', 'List all Gists', false)
  .option('-o, --own', 'List your Gists', false)
  .option('-x, --private', 'List private Gists', false)
  .option('-s, --starred', 'List starred Gists', false)
  .option('-p, --public', 'List public Gists', false)
  .option('-f, --files', 'List files of Gist', false)
  .action(
    ({
      starred: isStarred,
      private: isPrivate,
      public: isPublic,
      all: isAll,
      own: isOwn,
      files: withFiles,
    }) =>
      executeIfAuthorized(async () => {
        const options = getOptions({ isStarred, isPrivate, isPublic, isAll, isOwn })
        if (options) {
          const gists = await getGistsByOptions(options)
          listGists(gists, withFiles)
        } else {
          const { choice } = await promptListChoice()
          const gists = await getGistsByOptions(choice)
          listGists(gists, withFiles)
        }
      })
  )

program
  .command('copy')
  .description('Copies the id of a gist to the clipboard')
  .option('-a, --all', 'List all Gists', false)
  .option('-o, --own', 'List your Gists', false)
  .option('-x, --private', 'List private Gists', false)
  .option('-s, --starred', 'List starred Gists', false)
  .option('-p, --public', 'List public Gists', false)
  .action(({ starred: isStarred, private: isPrivate, public: isPublic, all: isAll, own: isOwn }) =>
    executeIfAuthorized(async () => {
      const options = getOptions({ isStarred, isPrivate, isPublic, isAll, isOwn })
      if (options) {
        const gists = await getGistsByOptions(options)
        interactiveCopyGistId(gists)
      } else {
        const { choice } = await promptListChoice()
        const gists = await getGistsByOptions(choice)
        interactiveCopyGistId(gists)
      }
    })
  )

program
  .command('open [id]')
  .description('Opens a gist in your browser')
  .option('--id <id>', 'Gist id for non-interactive update')
  .option('-a, --all', 'List all Gists', false)
  .option('-o, --own', 'List your Gists', false)
  .option('-x, --private', 'List private Gists', false)
  .option('-s, --starred', 'List starred Gists', false)
  .option('-p, --public', 'List public Gists', false)
  .action(
    (
      id,
      {
        id: optId,
        starred: isStarred,
        private: isPrivate,
        public: isPublic,
        all: isAll,
        own: isOwn,
      }
    ) =>
      executeIfAuthorized(async () => {
        id = id || optId
        if (id) {
          openGistById(id)
        } else {
          const options = getOptions({ isStarred, isPrivate, isPublic, isAll, isOwn })
          if (options) {
            const gists = await getGistsByOptions(options)
            interactiveOpenGist(gists)
          } else {
            const { choice } = await promptListChoice()
            const gists = await getGistsByOptions(choice)
            interactiveOpenGist(gists)
          }
        }
      })
  )

program
  .command('create <files...>')
  .description('Creates a new gist')
  .option('-x, --private', 'Create private Gist', true)
  .option('-p, --public', 'Create public Gists', false)
  .option('-d, --description <description>', 'Set the gist description')
  .action((filesPaths, { private: isPrivate, description }) =>
    executeIfAuthorized(() => {
      const files = getFileContents(filesPaths)
      const gist = {
        description,
        public: !isPrivate,
        files,
      }
      createGist(gist)
    })
  )

// program
//   .command('add  <files...>')
//   .description('')
//   .option('--id <id>', 'Gist id for non-interactive add')
//   .option('-d, --description <description>', 'Set the gist description')
//   .action((files, { id }) =>
//     executeIfAuthorized(() => {
//       const result = getFileContents(files)
//       console.log(result)
//       console.log('files', files)
//       console.log('Id', id)
//       //TODO: Add file to gist
//     })
//   )

program
  .command('download [id]')
  .description('Downloads a gist or gist file')
  .option('--id <id>', 'Gist id')
  .option('-a, --all', 'List all Gists', false)
  .option('-o, --own', 'List your Gists', false)
  .option('-x, --private', 'List private Gists', false)
  .option('-s, --starred', 'List starred Gists', false)
  .option('-p, --public', 'List public Gists', false)
  .action(
    (
      id,
      {
        id: optId,
        starred: isStarred,
        private: isPrivate,
        public: isPublic,
        all: isAll,
        own: isOwn,
      }
    ) =>
      executeIfAuthorized(async () => {
        id = id || optId
        if (id) {
          const { data: gist } = await getGist(id)
          downloadGist(gist)
        } else {
          const options = getOptions({ isStarred, isPrivate, isPublic, isAll, isOwn })
          if (options) {
            const gists = await getGistsByOptions(options)
            interactiveDownloadGist(gists)
          } else {
            const { choice } = await promptListChoice()
            const gists = await getGistsByOptions(choice)
            interactiveDownloadGist(gists)
          }
        }
      })
  )

program
  .command('search [query]')
  .description('Searches for gists')
  .option('-l, --list', 'List search result')
  .option('-c, --copy', 'Copy the id of one resulted gist')
  .option('-o, --open', 'Open one resulted gist in browser')
  .option('-d, --download', 'Download resulted gists')
  .action((query, { list, copy, open, download }) =>
    executeIfAuthorized(async () => {
      const action = getFunction({ list, copy, open, download })

      if (query) {
        const gists = await getGistsByQuery(query)
        action(gists)
      } else {
        const gists = await interactiveSearchGist()
        action(gists)
      }
    })
  )

program
  .command('delete [id]')
  .description('Deletes a gist from github')
  .option('-x, --private', 'List private Gists', false)
  .option('-p, --public', 'List public Gists', false)
  .action((id, { private: isPrivate, id: optId, starred }) =>
    executeIfAuthorized(async () => {
      id = id || optId
      if (id) {
        const { continueDelete } = await promptConfirmDelete()
        if (continueDelete) {
          deleteGist(id)
        }
      } else {
        const gists = await getPrivateOrStarredGists(starred, isPrivate)
        interactiveDeleteGist(gists)
      }
    })
  )

// TODO: Implement content handling stdout
// TODO: Implement Update functionality
// TODO: Implement Add functionality

const run = () => {
  // clear()
  program.parse(process.argv)
}

run()
