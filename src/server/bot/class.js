const moment = require('moment');
const TelegramBot = require('node-telegram-bot-api');
const commands = require('./commands');

class Bot extends TelegramBot {
  constructor(token, options) {
    super(token, options);
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
    this.inlineMessages = {};
    setInterval(() => {
      const data = this.nextAction;
      console.log(new Date(), ' - ', { data });
    }, 10000);
    // this.nextAction = {
    //   "chatId": {
    //     action: () => { },
    //     timeoutId: 123,
    //     type: 'inline/text',
    //     inlineMessageId: 1231321
    //   }
    // };
  }

  appendUserData(chatId, type, action) {
    if (!this.nextAction[chatId]) this.nextAction[chatId] = {};
    this.nextAction[chatId].action = action;
    this.nextAction[chatId].type = type;
  }

  clearNextAction(chatId) {
    delete this.nextAction[chatId];
  }

  clearInlineMessage(chatId) {
    delete this.inlineMessages[chatId];
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
    this.appendUserData(chatId, type, action);
    this.setActionTimeout(chatId);
  }

  async handleNextAction(chatId, msg) {
    clearTimeout(this.nextAction[chatId].timeoutId);
    const handleAction = this.nextAction[chatId].action;
    this.clearNextAction(chatId);
    await handleAction(msg);
  }

  async cleanMarkupEntities(chatId) {
    const messageIdToClear = this.inlineMessages[chatId].messageId;
    await this.editMessageReplyMarkup(null, { chat_id: chatId, message_id: messageIdToClear });
    delete this.nextAction.inlineMessageId;
  }

  async sendInlineMessage(chatId, text, options) {
    const msgSent = await this.sendMessage(chatId, text, {
      reply_markup: {
        inline_keyboard: options
      }
    });

    this.inlineMessages[chatId] = {
      messageId: msgSent.message_id
    }
  }

  checkCommand(msgText) {
    // tratar futuramente isso
    msgText = msgText.split(' ')[0];
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