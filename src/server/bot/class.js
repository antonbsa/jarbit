const moment = require('moment');
const TelegramBot = require('node-telegram-bot-api');
const commands = require('./commands');

class Bot extends TelegramBot {
  constructor(token, options) {
    super(token, options);
    this.nextTextAction = null;
    this.lastInlineMessageId = null;
    this.nextInlineAction = null;

    this.log = {
      //TODO: apply style
      info: (...args) => {
        const log = this.baseLog(...args);
        if (log) console.info(...log);
      },
      error: (...args) => {
        const log = this.baseLog(...args);
        if (log) console.error(...log);
      }
    }
  }

  baseLog() {
    if (process.env.DEBUG === 'true') {
      const date = moment(new Date()).format('DD-MMM-YYYY HH:mm:ss');
      const args = Array.prototype.slice.call(arguments);
      args.unshift(`${date} `);
      return args;
    }
  }

  setNextTextAction(func) {
    this.nextInlineAction = null;
    this.nextTextAction = func;
  }

  async handleNextTextAction(msg) {
    const handler = this.nextTextAction;
    this.nextTextAction = null;
    await handler(msg);
  }

  setNextInlineAction(func) {
    this.nextTextAction = null;
    this.nextInlineAction = func;
  }

  async handleNextInlineAction(msg) {
    const handler = this.nextInlineAction;
    this.nextInlineAction = null;
    await handler(msg);
  }

  async cleanMarkupEntities(chatId) {
    await this.editMessageReplyMarkup(null, { chat_id: chatId, message_id: this.lastInlineMessageId });
    this.lastInlineMessageId = null;
    this.nextInlineAction = null;
  }

  async sendInlineMessage(chatId, text, options) {
    const msgSent = await this.sendMessage(chatId, text, {
      reply_markup: {
        inline_keyboard: options
      }
    });
    this.lastInlineMessageId = msgSent.message_id;
  }

  checkCommand(msgText) {
    // tratar futuramente isso
    msgText = msgText.split(' ')[0];
    console.log({ msgText })
    return commands.find(e => msgText == `/${e.command}`);
  }

  removeCommand(msgText) {
    // improve this function checkin initial '/'
    const text = msgText.split(' ');
    text.shift();
    return text.join(' ');
  }
}

module.exports = exports = Bot;