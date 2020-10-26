# GISTI

> GistI(nteractive) - The interactive CLI for gist

To learn more, visit [https://github.com/pascalrogalla/gisti](https://github.com/pascalrogalla/gisti)

## DESCRIPTION

Gisti is a command line tool that supports interactive gist handling in your terminal.

## WHY?

Inspired by `yarn upgrade-interactive`,

this interactive command line tool is designed to act with github gists in an easy way.

## Install

### npm

`npm install -g gist`

### yarn

`yarn global add gisti`

## Usage

`gisti [options] [command]`

```
Options:
  -V, --version                output the version number
  -h, --help                   output usage information

Commands:
  auth [options] [token]       Sets/Updates the personal access token
  list [options]               List your gists
  copy [options]               Copies the id of a gist to the clipboard
  open [options] [id]          Opens a gist in your browser
  create [options] <files...>  Creates a new gist
  download [options] [id]      Downloads a gist or gist file
  search [options] [query]     Searches for gists
  delete [options] [id]        Deletes a gist from github
```

### Auth

`gisti auth [options] [token]`

```
Options:
  -t, --token <token>  Set token
  -h, --help           output usage information
```

### List

`gisti list [options]`

```
Options:
  -x, --private  List private Gists
  -s, --starred  List starred Gists
  -p, --public   List public Gists
  -f, --files    List files of Gist
  -h, --help     output usage information
```

### Copy

`gisti copy [options]`

```
Options:
  -x, --private  List private Gists
  -s, --starred  List starred Gists
  -p, --public   List public Gists
  -h, --help     output usage information
```

### Open

`gisti open [options] [id]`

```
Options:
  --id <id>      Gist id for non-interactive update
  -x, --private  List private Gists
  -s, --starred  List starred Gists
  -p, --public   List public Gists
  -h, --help     output usage information
```

### Create

`gisti create [options] <files...>`

```
Options:
  -x, --private                    Create private Gist
  -p, --public                     Create public Gists
  -d, --description <description>  Set the gist description
  -h, --help                       output usage information
```

### Download

`gisti download [options] [id]`

```
Options:
  --id <id>      Gist id
  -x, --private  List private Gists
  -s, --starred  List starred Gists
  -p, --public   List public Gists
  -h, --help     output usage information
```

### Download

`gisti search [options] [query]`

```
Options:
  -l, --list      List search result
  -c, --copy      Copy the id of one resulted gist
  -o, --open      Open one resulted gist in browser
  -d, --download  Download resulted gists
  -h, --help      output usage information
```

### Delete

`gisti delete [options] [id]`

```
Options:
  -x, --private  List private Gists
  -p, --public   List public Gists
  -h, --help     output usage information
```

## WIP - Planned Features

- Update

  Update your gist. Make a gist private, Set or change your description

- Add

  Add a file to an existing gist

- Content

  Print the content of a gist to stdout

- Delete option -f, --file

  Delete a specific file of an gist

## Website

[https://github.com/pascalrogalla/gisti](https://github.com/pascalrogalla/gisti)

## CONFIGURATION

Add your github personal token

`gisti auth [token]`

## BUGS

Please report any bugs to https://github.com/pascalrogalla/gisti/issues

## LICENSE

Copyright (c) 2019, Pascal Rogalla (MIT License).

## SEE ALSO

https://github.com/defunkt/gist

https://github.com/jdowner/gist

https://github.com/jrbasso/gistit
