import Setting from "../models/Setting.js";
import Message from "../models/Message.js";

export default {
  name: "identity",
  description: "Set bot identity",
  async execute(message, args) {
    console.log(args)
    if (!args.length) {
      const identity = await Setting.findOne({ key: "identity" });
      return message.reply(identity.value);
    }
    await Message.deleteMany({ room: message.channel.id })
    await Setting.findOneAndUpdate({ key: "identity" }, { value: args.join(" ") });
    return message.reply("Identity set.").catch(console.error);
  }
};
