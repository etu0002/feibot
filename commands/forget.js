import Message from "../models/Message.js";

export default {
  name: "forget",
  description: "Makes the bot to forget all conversation context",
  async execute(message) {
    await Message.deleteMany({ room: message.channel.id })
    return message.reply('Message context deleted.').catch(console.error);
  }
};
