import pkg from './package.json'
import clear from 'clear'
import program from 'commander'
import fs from 'fs'

import lolcat from 'lolcatjs'
lolcat.options.seed = 744

import github from './lib/github'

import {
  interactiveDownloadGist,
  interactiveOpenGist,
  interactiveCopyGistId,
  interactiveSearchGist,
  //interactiveUpdateGist,
  openGist,
  listGists,
} from './lib/gist'

import { createGist, getGist, getPrivateOrStarredGists, getGistsByQuery } from './lib/api'

import { executeIfAuthorized, executeIfNotAuthorized } from './lib/utils'

const openGistById = async id => {
  const gist = await getGist(id)
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

program
  .name('gisti')
  .description('GISTI - The interactive CLI for gist')
  .version(pkg.version)

program
  .command('list')
  .alias('ls')
  .description('List your gists')
  .option('-x, --private', 'List private Gists', false)
  .option('-s, --starred', 'List starred Gists', false)
  .option('-p, --public', 'List starred Gists', false)
  .action(({ starred, private: isPrivate }) =>
    executeIfAuthorized(() => {
      getPrivateOrStarredGists(starred, isPrivate).then(gists => {
        listGists(gists)
      })
    })
  )

program
  .command('copy')
  .alias('cp')
  .description('Copy the id of a gist to clipboard')
  .option('-x, --private', 'List private Gists', false)
  .option('-s, --starred', 'List starred Gists', false)
  .option('-p, --public', 'List starred Gists', false)
  .action(({ starred, private: isPrivate }) =>
    executeIfAuthorized(() => {
      console.log(starred, isPrivate)
      getPrivateOrStarredGists(starred, isPrivate).then(gists => {
        interactiveCopyGistId(gists)
      })
    })
  )

program
  .command('open [id]')
  .alias('opn')
  .description('')
  .option('--id <id>', 'Gist id for non-interactive update')
  .option('-x, --private', 'List private Gists', false)
  .option('-s, --starred', 'List starred Gists', false)
  .option('-p, --public', 'List starred Gists', false)
  .action((id, { id: optId, starred, private: isPrivate }) =>
    executeIfAuthorized(() => {
      console.log(starred, isPrivate)
      getPrivateOrStarredGists(starred, isPrivate).then(gists => {
        id = id || optId
        if (id) {
          openGistById(id)
        } else {
          interactiveOpenGist(gists)
        }
      })
    })
  )

const getFileContents = filePaths =>
  filePaths.reduce((files, path) => {
    const parts = path.split('/')
    const filename = parts[parts.length - 1]
    const content = fs.readFileSync(path, 'utf8')
    return { ...files, [filename]: { content } }
  }, {})

program
  .command('create <files...>')
  .alias('c')
  .description('')
  .option('-x, --private', 'Create private Gist', true)
  .option('-p, --public', 'List starred Gists', false)
  .option('-d, --description <description>', 'Set the gist description')
  .action((filesPaths, { private: isPrivate, description }) =>
    executeIfAuthorized(() => {
      console.log(isPrivate)
      const files = getFileContents(filesPaths)
      const gist = {
        description,
        public: !isPrivate,
        files,
      }
      createGist(gist)
    })
  )

program
  .command('update [file] [id]')
  .alias('up')
  .description('')
  .option('-x, --private', 'Make Gist private', false)
  .option('-p, --public', 'List starred Gists', false)
  .option('--id <id>', 'Gist id for non-interactive update')
  .action((file, id, { private: isPrivate, id: optId }) =>
    executeIfAuthorized(() => {
      id = id || optId
      console.log('file', file)
      console.log('Private', isPrivate)
      console.log('Id', id)
    })
  )

program
  .command('add  <files...>')
  .description('')
  .option('--id <id>', 'Gist id for non-interactive add')
  .option('-d, --description <description>', 'Set the gist description')
  .action((files, { id }) =>
    executeIfAuthorized(() => {
      const result = getFileContents(files)
      console.log(result)
      console.log('files', files)
      console.log('Id', id)
    })
  )

program
  .command('download [id]')
  .alias('dl')
  .description('')
  .option('--id <id>', 'Gist id')
  .option('-x, --private', 'Make Gist private', false)
  .option('-s, --starred', 'Search your starred gists', false)
  .option('-p, --public', 'List starred Gists', false)
  .action((id, { private: isPrivate, id: optId, starred }) =>
    executeIfAuthorized(() => {
      const id = id || optId
      if (id) {
        console.log(`TODO: Download gist with id ${id}`)
      } else {
        if (id) {
          console.log(id)
          //download gist
        } else {
          getPrivateOrStarredGists(starred, isPrivate).then(gists => {
            interactiveDownloadGist(gists)
          })
        }
      }
    })
  )

program
  .command('search [query]')
  .alias('s')
  .description('')
  .option('-l, --list', 'List search result')
  .option('-c, --copy', 'Copy the id of one resulted gist')
  .option('-o, --open', 'Open one resulted gist in browser')
  .option('-d, --download', 'Download resulted gists')
  .action((query, { list, copy, open, download }) =>
    executeIfAuthorized(() => {
      const action = getFunction({ list, copy, open, download })
      getGistsByQuery(query).then(gists => {
        if (query) {
          action(gists)
        } else {
          interactiveSearchGist(gists, action)
        }
      })
    })
  )

program
  .command('delete [id]')
  .alias('rm')
  .description('')
  .option('--id <id>', 'Gist id')
  .action((id, { id: optId }) =>
    executeIfAuthorized(() => {
      id = id || optId
      if (id) {
        console.log('Id', id)
      } else {
        //interactiveDeleteGist
      }
    })
  )

program
  .command('content [id] <files...>')
  .alias('gc')
  .description('stdout the gist content')
  .option('--id <id>', 'Gist id')
  .action((id, files, { id: optId }) =>
    executeIfAuthorized(() => {
      id = id || optId
      if (id) {
        console.log('Id', id)
      } else {
        //interactiveOutputContent
      }
    })
  )

const run = () => {
  clear()
  program.parse(process.argv)
  if (program.token) {
    executeIfNotAuthorized(() => github.setToken(program.token))
  }
}

run()
