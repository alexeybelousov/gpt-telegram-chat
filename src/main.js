import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import config from 'config';
import { chatGPT, transcriptionGPT, ROLES } from './gpt.js';
import { Loader } from './loader.js';
import { ogg } from './ogg.js';
import { removeFile } from './utils.js';

const INITIAL_SESSION = {
  messages: [],
};

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
  handlerTimeout: Infinity,
})

bot.use(session());

bot.command('new', async (ctx) => {
  ctx.session = INITIAL_SESSION;

  await ctx.reply('Забыл всю историю');
});

bot.command('start', ctx => {
  ctx.session = INITIAL_SESSION;

  ctx.reply('Привет! Чем я могу тебе помочь?');
})

bot.on(message('text'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  
  try {
    const loader = new Loader(ctx);
    
    loader.show();
    
    ctx.session.messages.push({ role: ROLES.USER, content: ctx.message.text });

    const response = await chatGPT(ctx.session.messages);

    if (!response) {
      return console.log('Нет ответа от GPT chat');
    }

    loader.hide();

    ctx.session.messages.push({ role: ROLES.ASSISTANT, content: response.content });

    ctx.reply(response.content);

  } catch (error) {
    console.log('openai text message: ', error.message);
  }
})

bot.on(message('voice'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;

  try {
    const loader = new Loader(ctx);
    
    loader.show();

    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = ctx.message.from.id;
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);

    const text = await transcriptionGPT(mp3Path);

    removeFile(mp3Path);

    ctx.session.messages.push({ role: ROLES.USER, content: text });

    const response = await chatGPT(ctx.session.messages);

    if (!response) {
      return console.log('Нет ответа от GPT chat');
    }

    loader.hide();

    ctx.session.messages.push({ role: ROLES.ASSISTANT, content: response.content });

    ctx.reply(response.content);

  } catch (error) {
    console.log('voice message: ', error.message);
  }
});

bot.launch()