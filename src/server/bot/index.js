require('dotenv').config();
const Bot = require('./class');
const commands = require('./commands');
const { botApiToken } = require('../params');

function initBot() {
  const bot = new Bot(botApiToken, { polling: true });

  //TODO: mudar o nome da varivel debaixo
  const commandsArray = commands.map(e => {
    const { command, description } = e;
    return {
      command,
      description,
    };
  })
  bot.setMyCommands(commandsArray);

  //TODO: add message to a new user

  bot.onText(/getLocation/, (msg) => {
    const opts = {
      reply_markup: JSON.stringify({
        keyboard: [
          [{text: 'Location', request_location: true}],
          [{text: 'Contact', request_contact: true}],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    };
    bot.sendMessage(msg.chat.id, 'Contact and Location request', opts);
    bot.on('location', (msg) => {
      console.log('=== location')
      console.log(msg)
      // console.log(msg.location.latitude);
      // console.log(msg.location.longitude);
    });
  });

  bot.on('callback_query', async (msg) => {
    const message = msg.message;
    const chatId = message.chat.id;
    console.log('dentro callbck handler: ', msg)
    try {
      await bot.handleNextAction(chatId, msg);
    } catch (err) {
       (err)
      await bot.sendMessage(chatId, `deu erro: ${err.message}`);
    }
    await bot.cleanMarkupEntities(chatId, msg.message.message_id);
  })

  bot.on('message', async (msg) => {
    //TODO: check the change from excessive if/else to if/return
    console.log('== generico')
    console.log(msg)
    const chatId = msg.chat.id;
    const msgText = msg.text;
    const nextAction = bot.nextAction[chatId];

    //! Check if user is registered :: maybe not here

    const searchCommand = bot.checkCommand(msgText);
    if (searchCommand?.command == 'cancel') {
      return searchCommand.action(msg, bot);
    }

    if (nextAction?.type == 'inline') {
      bot.sendMessage(chatId, 'Estava esperando uma poll, vou cancelar ela.');
      bot.clearNextAction(chatId);
      return bot.cleanMarkupEntities(chatId);
    }

    if (nextAction) {
      bot.handleNextAction(chatId, msg);
      console.log('== TAVA ESPERANDO!');
    } else {
      console.log('ta nao');
      if (searchCommand) {
        console.log('achou');
        searchCommand.action(msg, bot);
      } else {
        console.log('NAO achou');
        if (msgText.charAt(0) == '/') {
          bot.sendMessage(chatId, 'Não conheço esse comando, dê uma olhada em /help')
        }
      }
    }
  });
  console.log('🤖 Bot initiated');
}

module.exports = exports = initBot;