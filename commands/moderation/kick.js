const { Message, Client } = require("discord.js");
const Discord = require("discord.js")

module.exports = {
    name: "kick",
    description: "Kicks the mentioned user.",
    aliases: [''],
    usage: "-kick [@user] [reason]",
    example: "-kick @Nobi He deserved it.",
    permissions: "KICK_MEMBERS",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        
        if(message.author.bot || message.channel.type === "dm") return;
        if(!message.member.permissions.has("KICK_MEMBERS")) return;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        const embed = new Discord.MessageEmbed()
        .setDescription('```Mention a user to kick.```')

        if(!member) return message.reply({embeds: [embed], allowedMentions: {repliedUser: false}});

        const unkickEmbed = new Discord.MessageEmbed()
        .setDescription('```Unable to kick.```')

        if(message.member.roles.highest.position <= member.roles.highest.position) return message.reply(
            {embeds: [unkickEmbed], allowedMentions: {repliedUser: false}}
            )

        const reason = args.slice(1).join(" ") || "No Reason";

        const directEmbed = new Discord.MessageEmbed()
        .setTitle('Kick Notice')
        .setDescription(`You've been punished in ${message.guild.name}.`)
        .addFields(
            {name: 'Action', value: 'Kick', inline: true},
            {name: 'Requested', value: message.author.tag, inline: true},
            {name: 'Reason', value: reason, inline: true}
        )
        .setFooter(`This message was generated from ${message.guild.name}.`)
        
         await member.send({embeds: [directEmbed]}).catch((err) => console.error(err));
            member.kick({ reason }) 

        const kickEmbed = new Discord.MessageEmbed()
        .setTitle('User Kicked')
        .setDescription('The mentioned user has been kicked.')
        .addFields(
            {name: 'Action', value: 'Kick', inline: true},
            {name: 'User', value: member.toString(), inline: true},
            {name: 'Requested', value: message.author.tag, inline: true},
            {name: 'Reason', value: (`\`\`\`${reason}\`\`\``), inline: true}
        )
        .setFooter(`Goodbye ${member.user.username}!`)

        message.reply({embeds: [kickEmbed], allowedMentions: {repliedUser: false}});
        
    }
}