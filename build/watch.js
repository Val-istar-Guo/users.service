const ts = require('ttypescript')
const chalk = require('chalk')
const nodemon = require('nodemon')

const formatHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
}

function watch() {
  const configPath = ts.findConfigFile(
    './',
    ts.sys.fileExists,
    'tsconfig.json'
  )

  if (!configPath) {
    throw new Error("Error: Could not find a valid 'tsconfig.json'.")
  }

  const createProgram = ts.createSemanticDiagnosticsBuilderProgram

  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  )

  return ts.createWatchProgram(host)
}

function reportDiagnostic(diagnostic) {
  console.error(chalk.red(`Error ${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())}`))
}

function reportWatchStatusChanged(diagnostic) {
  console.info(chalk.green(ts.formatDiagnostic(diagnostic, formatHost)))
}

async function main() {
  const watchProgram = await watch()
  const cwd = process.cwd()

  nodemon({
    env: process.env,
    script: `${cwd}/dist/index.js`,
    ext: 'js json',
    watch: [`${cwd}/dist`, `${cwd}/apis`],
    delay: 1000,
  })

  nodemon
    .on('start', () => {
      console.log(chalk.green('[Nodemon] Application Start'))
    })
    .on('quit', () => {
      console.log(chalk.green('[Nodemon] Application Close'))
      watchProgram.close()
      process.exit()
    })
    .on('restart', () => {
      console.log(chalk.green('[Nodemon] Restart'))
    })
}

main()
