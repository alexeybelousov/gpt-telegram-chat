import { OpenAI } from 'openai';
import config from 'config';

const CHATGPT_MODEL = 'gpt-3.5-turbo';
const ROLES = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user',
};

const openai = new OpenAI({
  apiKey: config.get('OPENAI_KEY')
});

const getMessage = (m) => m;

export async function chatGPT(message = '') {
  const messages = [{
    role: ROLES.USER,
    content: getMessage(message),
  }];

  try {
    const complition = await openai.chat.completions.create({
      messages,
      model: CHATGPT_MODEL,
    });

    return complition.choices[0].message;
  } catch (error) {
    console.log('Chat complition: ', error.message);
  }
}