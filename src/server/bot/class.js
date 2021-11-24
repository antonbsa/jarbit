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

    this.nextAction = {};
    // this.nextAction = {
    //   "chatId": {
    //     action: () => { },
    //     timeoutId: 123,
    //     type: 'inline/text'
    //   }
    // };
  }

  clearNextAction(chatId) {
    delete this.nextAction[chatId];
  }

  setActionTimeout(chatId) {
    const timeoutId = setTimeout((id) => {
      this.clearNextAction(id);
    }, 45 * 1000, chatId);  // 45 seconds

    this.nextAction[chatId].timeoutId = timeoutId;
  }

  baseLog() {
    if (process.env.DEBUG === 'true') {
      const date = moment(new Date()).format('DD-MMM-YYYY HH:mm:ss');
      const args = Array.prototype.slice.call(arguments);
      args.unshift(`${date} `);
      return args;
    }
  }

  setNextAction(chatId, type, action) {
    this.nextAction[chatId] = {
      action,
      type
    }
    this.setActionTimeout(chatId);
  }

  async handleNextAction(chatId, msg) {
    clearTimeout(this.nextAction[chatId].timeoutId);
    const handleAction = this.nextAction[chatId].action;
    this.clearNextAction(chatId);
    await handleAction(msg);
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