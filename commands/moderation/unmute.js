const { Message, Client } = require("discord.js");
const Discord = require("discord.js")
const ms = require('ms')

module.exports = {
    name: "unmute",
    description: "Unmutes the mentioned user.",
    aliases: ['m','tempmute'],
    usage: "-unmute [@user]",
    example: "-unmute @Nobi",
    permissions: "MANAGE_MESSAGES",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => { 
        if(message.author.bot || message.channel.type === "dm") return;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        const embed = new Discord.MessageEmbed()
        .setDescription('```Mention a user to mute.```')

        if(!member) return message.reply({embeds: [embed], allowedMentions: {repliedUser: false}});

        const noEmbed = new Discord.MessageEmbed()
        .setDescription('```Unable to unmute.```')

        if(message.member.roles.highest.position <= member.roles.highest.position || !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply(
            {embeds: [noEmbed], allowedMentions: {repliedUser: false}})

    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');

    await member.roles.remove(role)

    const appealEmbed = new Discord.MessageEmbed()
    .setTitle('Mute Appealed')
    .setDescription('The user\'s punishment has been appealed.')
    .addField('User',`\`\`\`${member.toString()}\`\`\``)
    await message.reply({embeds: [appealEmbed], allowedMentions: {repliedUser: false}})


    }
}