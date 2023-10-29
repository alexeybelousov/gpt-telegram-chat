import { OpenAI } from 'openai';
import config from 'config';
import { createReadStream } from 'fs';

const CHATGPT_MODEL = 'gpt-3.5-turbo';

export const ROLES = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user',
};

const openai = new OpenAI({
  apiKey: config.get('OPENAI_KEY')
});

export async function chatGPT(messages = []) {
  try {
    const complition = await openai.chat.completions.create({
      messages,
      model: CHATGPT_MODEL,
    });

    return complition.choices[0].message;
  } catch (error) {
    console.log('GPT complition: ', error.message);
  }
}

export async function transcriptionGPT(filePath) {
  try {
    const response = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: createReadStream(filePath),
    });

    return response.text;
  } catch (error) {
    console.log('GPT transcription: ', error.message);
  }
}

// class GPT {
//   constructor() {
//     this.openai = new OpenAI({
//       apiKey: config.get('OPENAI_KEY')
//     });
//   }

//   chat() {

//   }

//   async transcription(filePath) {
//     try {
//       const response = await this.openai.transcription.create(
//         createReadStream(filePath),
//         'whisper-1',
//       );

//       return response.data.text;
//     } catch (error) {
//       console.log('GPT transcription: ', error.message);
//     }
//   }
// }

// export const gpt = new GPT(config.get('OPENAI_KEY'));