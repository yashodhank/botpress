import path from 'path'
import fs from 'fs'
import util from '../util'
import chalk from 'chalk'

module.exports = function(projectPath, options) {
  const skip = !!options.skip
  let botpress = null
  projectPath = path.resolve(projectPath || '.')

  if (!skip) {
    try {
      botpress = require(path.join(projectPath, 'node_modules', '@botskin/botpress'))
    }
    catch (err)
    {
      util.print('error', '(fatal) The project does not have botpress installed as a dependency')
      util.print('You need to `npm install botpress --save` in the bot\'s project')
      util.print('Please refer to `botpress init` to create a new bot the proper way')
      process.exit(1)
    }
  }

  const botfile = path.join(projectPath, 'botfile.js')
  if (!fs.existsSync(botfile)) {
    util.print('error', `(fatal) No ${chalk.bold('botfile.js')} file found at: ` + botfile)
    process.exit(1)
  }

  const bot = new botpress({ botfile })
  bot.start()
}