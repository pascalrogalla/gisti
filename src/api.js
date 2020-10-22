import Octokit from '@octokit/rest'
import Configstore from 'configstore'

import { textMatchSearchWords } from './utils'
import pkg from '../package.json'

const conf = new Configstore(pkg.name, {}, { globalConfigPath: true })

const auth = conf.get('github.token')
const octokit = new Octokit({
  auth,
})

export const getPrivateOrStarredGists = (starred, isPrivate) => {
  switch (isPrivate * 2 + starred) {
    case 1:
      return getStarredGists()
    case 2:
      return getPrivateGists()
    default:
      return getGists()
  }
}

export const getGists = async () => {
  const { data: gists } = await octokit.gists.list()
  return gists
}

export const getPrivateGists = async () => {
  const { data } = await octokit.gists.list()
  return data.filter(({ public: p }) => p === false)
}

export const getPublicGists = async () => {
  const { data } = await octokit.gists.listPublic()
  return data.filter(({ public: p }) => p === false)
}

export const getStarredGists = async () => {
  const { data: gists } = await octokit.gists.listStarred()
  return gists
}

export const getGist = (id) => octokit.gists.get({ gist_id: id })

export const getGistsByQuery = async (query) => {
  const gists = await getGists()
  if (query) {
    return gists.filter(({ id, description }) =>
      textMatchSearchWords(`${id} ${description}`, query.split(' '))
    )
  } else {
    return gists
  }
}

export const createGist = (gist) => octokit.gists.create(gist)

export const updateGist = (id, files, description) => {
  console.log(files, id)
  octokit.gists.update({
    gist_id: id,
    files,
    description,
  })
}

export const deleteGist = (id) =>
  octokit.gists.delete({
    gist_id: id,
  })
