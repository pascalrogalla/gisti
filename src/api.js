import github from './github'

import { textMatchSearchWords, output } from './utils'

const octokit = github.getInstance()

export const getGistsByOptions = async (options) => {
  let gists = []
  if (options & output.PUBLIC) {
    const publicGists = await getGists()
    gists = [...gists, ...publicGists]
  }
  if (options & output.PRIVATE) {
    const privateGists = await getPrivateGists()
    gists = [...gists, ...privateGists]
  }
  if (options & output.STARRED) {
    const starredGists = await getStarredGists()
    gists = [...gists, ...starredGists]
  }
  return gists
}

export const getAllGists = async () => {
  const { data: ownGists } = await octokit.gists.list()
  const { data: starredGists } = await octokit.gists.listStarred()
  return [...ownGists, ...starredGists]
}

export const getGists = async () => {
  const { data: gists } = await octokit.gists.list()
  return gists
}

export const getPrivateGists = async () => {
  const { data } = await octokit.gists.list()
  return data.filter(({ public: isPublic }) => isPublic === false)
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
