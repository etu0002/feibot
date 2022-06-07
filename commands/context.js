import { getMessages } from "../utils/openai.js";

export default {
  name: "context",
  description: "Show the conversation context",
  async execute(message) {
    const messages = await getMessages(message.channel.id);
    messages.reverse()

    let prompt = '';

    messages.forEach(message => {
        prompt += `\n${message.user.name}: ${message.text}`
    })

    return message.reply(prompt).catch(console.error);
  }
};
