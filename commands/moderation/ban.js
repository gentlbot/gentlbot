const { Message, Client } = require("discord.js");
const Discord = require("discord.js")

module.exports = {
    name: "ban",
    description: "Bans the mentioned user.",
    aliases: [''],
    usage: "-ban [@user] [reason]",
    example: "-ban @Nobi He deserved it.",
    permissions: "BAN_MEMBERS",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        
        if(message.author.bot || message.channel.type === "dm") return;
        if(!message.member.permissions.has("BAN_MEMBERS")) return;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        const embed = new Discord.MessageEmbed()
        .setDescription('```Mention a user to ban.```')

        if(!member) return message.reply({embeds: [embed], allowedMentions: {repliedUser: false}});

        const unbanEmbed = new Discord.MessageEmbed()
        .setDescription('```Unable to ban.```')

        if(message.member.roles.highest.position <= member.roles.highest.position) return message.reply(
            {embeds: [unbanEmbed], allowedMentions: {repliedUser: false}}
            )

        const reason = args.slice(1).join(" ") || "No Reason";

        const directEmbed = new Discord.MessageEmbed()
        .setTitle('Ban Notice')
        .setDescription(`You've been punished in ${message.guild.name}.`)
        .addFields(
            {name: 'Action', value: 'Ban', inline: true},
            {name: 'Requested', value: message.author.tag, inline: true},
            {name: 'Reason', value: reason, inline: true}
        )
        .setFooter(`This message was generated from ${message.guild.name}.`)
        
         await member.send({embeds: [directEmbed]}).catch((err) => console.error(err));
            member.ban({ reason })

        const banEmbed = new Discord.MessageEmbed()
        .setTitle('User Banned')
        .setDescription('The mentioned user has been banned.')
        .addFields(
            {name: 'Action', value: 'Ban', inline: true},
            {name: 'User', value: member.toString(), inline: true},
            {name: 'Requested', value: message.author.tag, inline: true},
            {name: 'Reason', value: (`\`\`\`${reason}\`\`\``), inline: true}
        )
        .setFooter(`Goodbye ${member.user.username}!`)

        message.reply({embeds: [banEmbed], allowedMentions: {repliedUser: false}});
        
    }
}