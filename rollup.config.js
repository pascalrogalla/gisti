import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/main.js',
  output: {
    file: process.env.PRODUCTION ? 'dist/min.bundle.js' : 'dist/bundle.js',
    format: 'cjs',
    strict: false,
    banner: '#! /usr/bin/env node\n',
    plugins: [process.env.PRODUCTION && terser({ compress: true })],
  },
  plugins: [resolve(), json(), commonjs({ include: 'node_modules/**' })],
  external: [
    '@octokit/rest',
    'chalk',
    'clear',
    'clipboardy',
    'clui',
    'commander',
    'configstore',
    'figlet',
    'fs',
    'https',
    'inquirer',
    'lolcatjs',
    'opn',
    'terminal-link',
  ],
}
