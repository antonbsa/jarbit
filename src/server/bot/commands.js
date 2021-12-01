const fs = require('fs');
const api = require('../services/api');

const allCommands = [];
//TODO: Melhorar onde vai ficar atribuido isso
const defaultOptions = [
  [
    {
      text: 'Sim',
      callback_data: 1,
    },
    {
      text: 'Não',
      callback_data: 0,
    }
  ]
];

function setCommand(command, description, action) {
  allCommands.push({
    command,
    description,
    action
  })
}

setCommand('teste', 'usado para testes', async (msg, bot) => {
  const chatId = msg.chat.id;
  // criar função base para isso

  /**
   * baseFunction
   * chatId?
   * options
   * askMessageText
   * 
   * funcionalidade:
   * - envia a pergunta com as opções
   * - espera resposta e, quando recebe, retorna o valor (provavelmente trabalhar com boolean)
   * - depois limpa as perguntas
   * -- limpar caso receba mensagem normal (conferir esse comportamento)
   */
  await bot.sendInlineMessage(chatId, 'testezin', defaultOptions);

  bot.setNextAction(chatId, 'inline', async (msg) => {
    console.log('data: ', msg.data)
    const resp = parseInt(msg.data);
    await bot.sendMessage(chatId, `recebi: ${!!resp}`);
  });
})

setCommand('start', 'initial setup', async (msg, bot) => {
  const chatId = msg.chat.id;
  const resp = await api.get(`/user/check-chatid/${chatId}`);
  const { success, data } = resp.data;
  console.log(data)

  if (!success) {
    await bot.sendInlineMessage(chatId, 'Parece que você é novo por aqui! Vou salvar seus dados inicias, ok?', defaultOptions);
    bot.setNextAction(chatId, 'inline', async (msg) => {
      const msgData = parseInt(msg.data);
      if (!!msgData) {
        const { first_name: firstName, last_name: lastName, id: chatId, language_code: language } = msg.from;
        let { status } = resp;
        try {
          resp = await api.post('/user/store', {
            firstName,
            lastName,
            chatId,
            language,
          });
        } catch (err) {
          console.log(err.message);
        }

        if (status == 201) {
          await bot.sendMessage(chatId, 'Dados salvos!');
        }
      } else {
        await bot.sendMessage(chatId, 'Ok!');
      }
    })
  } else {
    await bot.sendMessage(chatId, 'Já sei seus dados iniciais! Está precisando de alguma ajuda? O comando /help pode ser útil');
  }
})

setCommand('brinks', 'só uma brinks', async (msg, bot) => {
  const chatId = msg.chat.id;
  const secretWord = 'LINDEZA'
  await bot.sendMessage(chatId, `Teste de mensagem, envie ${secretWord}`);
  bot.setNextAction(chatId, 'text', async (msg) => {
    if (msg.text.split(' ').some((e) => e.toUpperCase() == secretWord && e != secretWord)) {
      await bot.sendMessage(chatId, 'quase ein. me atento aos detalhes ... tenta de novo ai cpx');
      return;
    }
    if (msg.text.split(' ').some((e) => e === secretWord)) {
      await bot.sendMessage(chatId, 'ACERTOU MIZERAVI!!');
    } else {
      await bot.sendMessage(chatId, 'errou papai, tenta dnv');
    }
  })
})

// test commands
setCommand('adicionar', 'adiciona algum coisa', async (msg, bot) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, 'responda com algo');
  bot.setNextAction(chatId, 'text', async (msg) => {
    bot.sendInlineMessage(chatId, `voce mandou ${msg.text}?`, defaultOptions);
    bot.setNextAction(chatId, 'inline', async (msg) => {
      const data = parseInt(msg.data);
      if (!!data) {
        await bot.sendMessage(chatId, 'Dale!!')
      } else {
        await bot.sendMessage(chatId, 'Osh..')
      }
    });
  });
});

// Mainly commands
setCommand('cancel', 'cancela qualquer operação', async (msg, bot) => {
  const chatId = msg.chat.id;

  if (!bot.nextAction[chatId]) {
    return bot.sendMessage(chatId, 'Nenhuma operação em andamento para ser cancelada');
  } else {
    if (bot.inlineMessages[chatId]) await bot.cleanMarkupEntities(chatId);

    bot.clearNextAction(chatId);
    await bot.sendMessage(chatId, 'Cancelando operação.');
  }
})

setCommand('note', 'ver a desc', async (msg, bot) => {
  const chatId = msg.chat.id;

  const utcDate = msg.date * 1000;
  //TODO: Formatar melhor a data
  const date = new Date(utcDate).toJSON();
  const baseDataPath = './data.json';

  // TODO: melhorar essa atribuição;
  // provavelmente usar uma função separada pra isso, 
  // vai ser usado em todos os outros comandos 
  let input = (() => {
    const entireInput = msg.text;
    const inputSplited = entireInput.split(' ');
    if (inputSplited[1]) {
      inputSplited.shift();
      return inputSplited.join(' ');
    } else {
      return null;
    }
  })();

  if (!fs.existsSync(baseDataPath)) {
    const baseData = { data: [] };
    fs.writeFileSync(baseDataPath, JSON.stringify(baseData));
  }

  const dataRaw = JSON.parse(fs.readFileSync(baseDataPath));
  const { data } = dataRaw;
  console.log('data: ', data);
  const hasChatId = data.some(e => e.chatId == chatId);
  console.log({ hasChatId });

  const checkAndSaveNote = (msg) => {
    const noteText = msg.text;
    bot.sendInlineMessage(chatId, `Certo. A nota será: "${noteText}", confere?`, defaultOptions);
    bot.nextInlineAction = (msg) => {
      const message = msg.message;
      const msgData = parseInt(msg.data);
      if (!!msgData) {
        if (hasChatId) {
          let index;
          const userData = data.filter((e, i) => {
            index = i;
            return e.chatId == chatId;
          })[0];

          userData.notes.push({ text: noteText, date });
          data[index] = userData;
          dataRaw.data = data;
          console.log('chegou aqui')
          fs.writeFileSync('./data.json', JSON.stringify(dataRaw));
          bot.sendMessage(chatId, 'Nota adicionada!');
        } else {
          const userName = `${message.chat.first_name} ${message.chat.last_name}`;
          console.log({ userName })
          console.log({ data });
          data.push({
            chatId: chatId,
            userName,
            notes: [
              {
                text: noteText,
                date
              }
            ]
          })
          console.log({ data });
          dataRaw.data = data;
          console.log('chegou aqui')
          fs.writeFileSync('./data.json', JSON.stringify(dataRaw));
          bot.sendMessage(chatId, 'Primeira nota criada!');
        }
      } else {
        bot.sendMessage(chatId, 'Ta certo, vou cancelar essa e você inicia novamente caso queira salvar a nota');
      }
      bot.nextTextAction = null;
    }
  }

  if (input === null) {
    const options = [
      [
        {
          text: 'adicionar',
          callback_data: 'add',
        }], [
        {
          text: 'listar',
          callback_data: 'list',
        }
      ]
    ]
    bot.sendInlineMessage(chatId, 'o que queres fazer?', options);
    bot.setNextAction(chatId, 'inline', async (msg) => {
      const msgData = msg.data;
      switch (msgData) {
        case 'add':
          await bot.sendMessage(chatId, 'Envie a nota que deseja salvar');
          bot.setNextAction(chatId, 'text', checkAndSaveNote);
          break;
        case 'list':
          const userData = data.find(e => e.chatId === chatId);
          if (userData) {
            let listedNotesMsg = '===============';
            userData.notes.forEach(elem => {
              listedNotesMsg += '\n' +
                `"${elem.text}"\n` +
                `Adicionda em: ${elem.date}\n` +
                '===============';
            });
            await bot.sendMessage(chatId, listedNotesMsg);
          } else {
            await bot.sendInlineMessage(chatId, 'Nenhuma nota adicionada ainda. Deseja adicionar uma agora?', defaultOptions);
            bot.setNextAction(chatId, 'inline', async (msg) => {
              const msgData = parseInt(msg.data);
              if (!!msgData) {
                await bot.sendMessage(chatId, 'Envie a nota que deseja salvar');
                bot.setNextAction(chatId, 'text', checkAndSaveNote);
              } else {
                bot.sendMessage(chatId, 'Ok!');
              }
            })
          }
          break;
      }
    })
  } else {
    msg.text = bot.removeCommand(msg.text);
    checkAndSaveNote(msg);
  }
})

setCommand('help', 'uma lista do que eu posso te ajudar', async (msg, bot) => {
  const chatId = msg.chat.id;
  // bot.sendMessage(chatId, `Comandos disponíveis: ${allCommands.map(e => e.command).toString(' ')}`);
  await bot.sendMessage(chatId, 'Ainda preciso adicionar essa funcionalidade...');
})

setCommand('echo', 'só repito o que você mandar', async (msg, bot) => {
  const chatId = msg.chat.id;
  const text = bot.removeCommand(msg.text);
  if (!text) {
    await bot.sendMessage(chatId, 'nada para repetir :D');
    return;
  }
  await bot.sendMessage(chatId, text);
})

module.exports = exports = allCommands;