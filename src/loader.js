export class Loader {
  icons = ['☀️', '🌤', '⛅️', '☁️', '🌧', '🌩', '🌨', '❄️', '🌨', '🌩', '🌧', '☁️', '⛅️', '🌤'];
  message = null;
  interval = null;

  constructor(ctx) {
    this.ctx = ctx;
  }

  async show() {
    let cursor = 0;

    this.message = await this.ctx.reply(this.icons[cursor]);

    this.interval = setInterval(() => {
      cursor = cursor < this.icons.length - 1 ? cursor + 1 : 0;

      this.ctx.telegram.editMessageText(
        this.ctx.chat.id,
        this.message.message_id,
        null,
        this.icons[cursor],
      );
    }, 500);
  }

  hide() {
    clearInterval(this.interval);

    this.ctx.telegram.deleteMessage(
      this.ctx.chat.id,
      this.message.message_id,
    );
  }
}