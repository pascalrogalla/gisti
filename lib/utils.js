import chalk from 'chalk'
import figlet from 'figlet'
import lolcat from 'lolcatjs'

import github from './github'

export const textMatchSearchWords = (text, searchTermWords) =>
  searchTermWords.every(term => text.match(new RegExp(term, 'i')))

export const executeIfAuthorized = action => {
  const authorized = !!github.getStoredGithubToken()
  if (authorized) {
    action()
  } else {
    printHeader()
    console.log(chalk.red.bold('Set your personal github access token'))
    console.log(`run ${chalk.rgb(0, 160, 200).bold('gisti --token <token>')}`)
  }
}

export const executeIfNotAuthorized = action => {
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

export const getHelp = () => `
${chalk.bold('Usage')}
gisti [-l, --list] [-d, --download] [-o, --open] [-s, --starred] [-p, --private] [-v] [-h]

${chalk.bold('Arguments')}
--list, -i
List your gists

--download, -d
Download a gist

--open, -o [id]
Open a gist in your browser

--starred, -s
Just show starred gists for list, download or open

--private, -p
Just show private gists for list, download or open

--version, -v
Display the version of Gisti

--help, -h
Show this help

${chalk.bold('Configuration')}
Add your github personal token
gisti --token [token]
`
