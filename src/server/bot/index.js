require('dotenv').config();
const Bot = require('./class');
const commands = require('./commands');

const token = process.env.BOT_API_TOKEN;
if (!token) throw new Error('you need to provide the API TOKEN on .env file');

function initBot() {
  const bot = new Bot(token, { polling: true });
  console.log('= bot initiated')

  //TODO: mudar o nome da varivel debaixo
  const commandsArray = commands.map(e => {
    const { command, description } = e
    return {
      command,
      description,
    };
  })
  bot.setMyCommands(commandsArray);

  //TODO: add message to a new user

  bot.on('callback_query', async (msg) => {
    const message = msg.message;
    const chatId = message.chat.id;
    console.log('dentro callbck handler: ', msg)
    try {
      await bot.handleNextInlineAction(msg);
    } catch (err) {
      bot.sendMessage(chatId, `deu erro: ${err.message}`);
    }
    await bot.cleanMarkupEntities(chatId, msg.message_id);
  })

  bot.on('message', async (msg) => {
    //TODO: check the change from excessive if/else to if/return
    const chatId = msg.chat.id;
    const msgText = msg.text;

    const searchCommand = bot.checkCommand(msgText);
    if (searchCommand?.command == 'cancel') {
      searchCommand.action(msg, bot);
      return;
    }

    if (bot.nextInlineAction) {
      console.log(bot.nextInlineAction)
      bot.sendMessage(chatId, 'Estava esperando uma poll, vou cancelar ela.');
      await bot.cleanMarkupEntities(chatId);
    }

    if (bot.nextTextAction) {
      bot.handleNextTextAction(msg);
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
}

module.exports = exports = initBot;