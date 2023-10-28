import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import config from 'config';
import { chatGPT } from './chatgpt.js';
import { Loader } from './loader.js';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
  handlerTimeout: Infinity,
})

bot.start('start', ctx => {
  ctx.reply('Привет! Чем я могу тебе помочь?');
})

bot.on(message('text'), async (ctx) => {
  try {
    const loader = new Loader(ctx);
    
    loader.show();
    
    const text = ctx.message.text;
    const response = await chatGPT(text);

    if (!response) {
      return console.log('Нет ответа от GPT chat');
    }

    loader.hide();

    ctx.reply(response.content);
  } catch (error) {
    console.log('gpt reply', error.message);
  }
})

bot.launch()