const fs = require('fs');

async function confirmNote(bot, chatId, text) {
  return bot.sendMessage(chatId, `Certo. A nota será: "${text}", confere?`, {
    reply_markup: { force_reply: true }
  }).then(async msg => {
    await bot.onReplyToMessage(chatId, msg.message_id, (msg) => {
      const responseReplied = msg.text.toLowerCase();
      return responseReplied == 'sim';
    });
  });
}

async function askToAnswerNote(bot, chatId) {
  return bot.sendMessage(chatId, 'Reponda aqui com a nota que deseja salvar', {
    reply_markup: { force_reply: true }
  }).then(async msg => {
    await bot.onReplyToMessage(chatId, msg.message_id, async (msg) => {
      console.log('msg return: ', msg)
      return msg
    });
  })
}

async function saveNote(bot, chatId, input, baseDataPath, msg) {
  const date = new Date(msg.date).toJSON();

  const dataRaw = JSON.parse(fs.readFileSync(baseDataPath));
  const { data } = dataRaw;
  console.log('data: ', data);
  const hasChatId = data.some(e => e.chatId == chatId);
  console.log({ hasChatId });

  if (hasChatId) {
    let index;
    const userData = data.filter((e, i) => {
      index = i;
      return e.chatId == chatId;
    })[0];

    userData.notes.push({ noteData: input, date });
    data[index] = userData;
    dataRaw.data = data;

    fs.writeFileSync('./data.json', JSON.stringify(dataRaw));
    bot.sendMessage(chatId, 'Nota adicionada!');
  } else {
    const userName = `${msg.chat.first_name} ${msg.chat.last_name}`;
    data.push({
      chatId: chatId,
      userName,
      notes: [
        {
          notesData: input,
          date
        }
      ]
    })
    dataRaw.data = data;
    fs.writeFileSync('./data.json', JSON.stringify(dataRaw));
    bot.sendMessage(chatId, 'Primeira nota criada!');
  }
}

function cancel(bot, chatId) {
  bot.sendMessage(chatId, 'Tá certo, não vou salvar. Se ainda quiser salvar uma nota, só reiniciar esse processo');
}

exports.confirmNote = confirmNote;
exports.askToAnswerNote = askToAnswerNote;
exports.saveNote = saveNote;
exports.cancel = cancel;