const ts = require('ttypescript')
const chalk = require('chalk')
const nodemon = require('nodemon')

const formatHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
}

function watch() {
  return new Promise((resolve, reject) => {
    const configPath = ts.findConfigFile(
      "./",
      ts.sys.fileExists,
      "tsconfig.json"
    )

    if (!configPath) {
      throw new Error("[TTypescript] Could not find a valid 'tsconfig.json'.")
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

    const origCreateProgram = host.createProgram
    host.createProgram = (rootNames, options, host, oldProgram) => {
      console.log(chalk.green('[TTypescript] 开始初始化'))
      return origCreateProgram(rootNames, options, host, oldProgram)
    }
    const origPostProgramCreate = host.afterProgramCreate

    host.afterProgramCreate = program => {
      console.log(chalk.green('[TTypescript] 初始化完成'))
      resolve()
      origPostProgramCreate(program)
    }

    ts.createWatchProgram(host)
  })
}

function reportDiagnostic(diagnostic) {
  console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText( diagnostic.messageText, formatHost.getNewLine()))
}

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic) {
  console.info(ts.formatDiagnostic(diagnostic, formatHost))
}

async function main() {
  await watch()
  const cwd = process.cwd()

  nodemon({
    env: process.env,
    script: `${cwd}/lib/index.js`,
    ext: 'js json',
    watch: 'lib',
    delay: 2000,
  })

  nodemon
    .on('start', () => {
      console.log(chalk.green('[Nodemon] 应用启动'))
    })
    .on('quit', () => {
      console.log(chalk.green('[Nodemon] 应用退出'))
      process.exit()
    })
    .on('restart', (files) => {
      if (files) {
        files = files.map(file => file.replace(`${cwd}/lib`, `- ${cwd}/src`))
        console.log(chalk.green(`[Nodemon] 应用重启 变更文件列表：\n${files.join('\n')}\n`))
      } else {
        console.log(chalk.green('[Nodemon] 应用重启 无变更'))
      }
    })
}

main()
