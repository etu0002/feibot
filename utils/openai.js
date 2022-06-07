import { Configuration, OpenAIApi } from "openai";
import { config } from "./config.js";
import Message from "../models/Message.js";
import Setting from "../models/Setting.js";
import { encode } from "gpt-3-encoder";

const configuration = new Configuration({
    apiKey: config.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

export const getMessages = (room, limit) => Message.find({ room }).limit(limit).sort({ createdAt: -1 })

const generatePrompt = async (room, client, limit = 5) => {
    const messages = await getMessages(room, limit)
    messages.reverse()

    let botIdentity = await Setting.findOne({ key: "identity" })
    let botName = await Setting.findOne({ key: "name" })

    let prompt = `${botIdentity.value} My name is ${botName.value}.`

    messages.forEach(message => {
        prompt += `\n${message.user.name}: ${message.text}`
    })
    prompt += `\n${client.user.username}:`

    const encodedPrompt = encode(prompt)

    console.log(prompt)
    console.log(encodedPrompt)
    console.log(encodedPrompt.length)

    if (encodedPrompt.length > 3000) {
        return generatePrompt(room, client, limit - 1)
    }

    return prompt
}

export const getAiResponse = async (room, client) => {
    const prompt = await generatePrompt(room, client)
    
    let response = null

    try {
        response = await openai.createCompletion('text-davinci-002', {
            prompt,
            temperature: 0.9,
            top_p: 0.95,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
            max_tokens: 1000,
            stop: [`${client.user.username}:`]
        })

    } catch (error) {
        console.log('error')
        console.log(error.response.status)
        console.log(error.response.statusText)
        console.log(error.response.data)
    }

    return response
}

export const handleAi = async (message, client) => {
    // check if message is from a guild
    if (!message.guild) return;

    if(message.cleanContent && message.cleanContent !== 'Message context deleted.' && !message.cleanContent.startsWith(config.PREFIX)) {
        await Message.create({
            text: message.cleanContent,
            user: {
                id: message.author.id,
                name: message.author.username
            },
            room: message.channel.id,
        })    
    }

    // check if being ping
    if (message.content && message.content.toLowerCase().includes(`<@${client.user.id}>`)) {
        message.channel.sendTyping()
        const response = await getAiResponse(message.channel.id, client)
        if(response && response.data.choices.length > 0 && response.data.choices[0].text) {
            message.channel.send(response.data.choices[0].text)
                .catch(console.log)
        } else {
            console.log('no response')
        }
    }
}