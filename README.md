# GISTCLI

> GistCLI - The interactive CLI for gist

To learn more, visit [https://github.com/pascalrogalla/gisti](https://github.com/pascalrogalla/gisti)

## SYNOPSIS

`gisti [-l, --list] [-d, --download] [-o, --open] [-s, --starred] [-p, --private] [-v] [-h]`

## DESCRIPTION

GistCLI is a command line tool that supports interactive gist handling in your terminal.

## Website

[https://github.com/pascalrogalla/gisti](https://github.com/pascalrogalla/gisti)

## EXAMPLES

`npm install gisti -g`

`gisti -l`

`gisti -l -p`

`gisti -d -s`

`gisti -h`

`gisti -v`

## OPTIONS

`--list`, `-i`
List your gists

`--download`, `-d`
Download a gist

`--open`, `-o`
Open a gist in your browser

`--starred`, `-s`
Just show starred gists for list, download or open

`--private`, `-p`
Just show private gists for list, download or open

`--version`, `-v`
Display the version of GistCLI

`--help`, `-h`
Show this help

## CONFIGURATION

Add your github personal token
`gisti --token [token]`

## BUGS

Please report any bugs to https://github.com/pascalrogalla/gisti.

## LICENSE

Copyright (c) 2019, Pascal Rogalla (MIT License).

## SEE ALSO

https://github.com/defunkt/gist

https://github.com/jrbasso/gistit/
