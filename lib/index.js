import chalk from "chalk"

export const getHelp = () => `
${chalk.bold("Usage")}
gisti [-l, --list] [-d, --download] [-o, --open] [-s, --starred] [-p, --private] [-v] [-h]

${chalk.bold("Arguments")}
--list, -i
List your gists

--download, -d
Download a gist

--open, -o
Open a gist in your browser

--starred, -s
Just show starred gists for list, download or open

--private, -p
Just show private gists for list, download or open

--version, -v
Display the version of Gisti

--help, -h
Show this help

${chalk.bold("Configuration")}
Add your github personal token
gisti --token [token]
`
