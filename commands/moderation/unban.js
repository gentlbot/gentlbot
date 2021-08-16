const { Message, Client } = require("discord.js");
const Discord = require("discord.js")

module.exports = {
    name: "unban",
    description: "Revokes the mentioned user's ban.",
    aliases: [''],
    usage: "-unban [userID]",
    example: "-unban 541091076010803201",
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

        const embed = new Discord.MessageEmbed()
        .setDescription('```Input an ID.```')

        const userID = args[0];
        if(!userID) return message.reply({embeds: [embed], allowedMentions: {repliedUser: false}});

        const notBanned = new Discord.MessageEmbed()
        .setDescription('```User is not banned.```')

        const bannedMembers = await message.guild.bans.fetch();
        if(!bannedMembers.find((user) => user.user.id === userID))
            return message.reply({embeds: [notBanned], allowedMentions: {repliedUser: false}});

        message.guild.members.unban(userID);

        const revokedBan = new Discord.MessageEmbed()
        .setTitle('Ban Revoked')
        .setDescription('The user\'s ban has been revoked.')
        .addField('UserID',`\`\`\`${userID}\`\`\``)

        message.reply({embeds: [revokedBan], allowedMentions: {repliedUser: false}})
    }
}