import Mustache from 'mustache'
import _ from 'lodash'

module.exports = {
  default: {
    id: 'send-message',
    send: ({ message, originalEvent, state, flowContext }) => {
      let rendered = message.value

      let additionalData = { state }

      if (rendered && rendered.includes('{{')) {
        rendered = Mustache.render(rendered, {
          ...state,
          event: _.pick(originalEvent, ['raw', 'text', 'type', 'platform', 'user']),
          _context: {
            ..._.pick(flowContext, ['node', 'flowStack']),
            currentFlow: _.pick(flowContext.currentFlow, ['name', 'version', 'startNode'])
          }
        })
      }

      if (rendered && rendered[0] === '{' && rendered[rendered.length - 1] === '}') {
        // Check if it's JSON
        additionalData = { ...additionalData, ...JSON.parse(rendered) }
      } else if (rendered) {
        additionalData = { ...additionalData, text: rendered }
      }

      return originalEvent.reply(message.type, additionalData)
    }
  }
}
