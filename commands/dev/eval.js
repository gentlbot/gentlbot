const Discord = require("discord.js"),
      { post } = require("node-superfetch");

module.exports = {
    name: "eval",
    description: "Evaluates the command.",
    aliases: ['evaluate'],
    /**
    *
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
     */
    run: async (client, message, args) => {

  if (!client.config.owner.includes(message.author.id)) return;
  
  const embed = new Discord.MessageEmbed()
  .setTitle('Process Evaluated')
  .setDescription('The Process Has Been Evaluated.')
  .addField("Input", "```js\n" + args.join(" ") + "```")
  .setFooter('Here\'s what I fetched.')
  
  const embed2 = new Discord.MessageEmbed()
  .setDescription('```Please Include the Code.```')
  try {
    const code = args.join(" ");
    if (!code) return message.reply({embeds: [embed2] , allowedMentions: {repliedUser: false}});
    let evaled;
    
    if (code.includes(`SECRET`) || code.includes(`TOKEN`) || code.includes("process.env")) {
      evaled = "What are you trying to do there mate?";
    } else {
      evaled = eval(code);
    }
    
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled, {depth: 0});
    
    let output = clean(evaled);
    if (output.length > 1024) {
      const {body} = await post("https://hastebin.com/documents").send(output);
      embed.addField("Output", `https://hastebin.com/${body.key}.js`);
      } else {
      embed.addField("Output", "```js\n" + output + "```")
    }
    
    message.reply({embeds: [embed] , allowedMentions: {repliedUser: false}});
    
  } catch (error) {
    let err = clean(error);
    if (err.length > 1024) {
      const {body} = await post("https://hastebin.com/documents").send(err);
      embed.addField("Output", `https://hastebin.com/${body.key}.js`).setColor("RED");
    } else {
      embed.addField("Output", "```js\n" + err + "```").setColor("RED");
    }
    
    message.reply({embeds: [embed] , allowedMentions: {repliedUser: false}});
    }  
    }
}
function clean(string) {
    if (typeof text === "string") {
      return string.replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
    } else {
      return string;
    }
  }


