const { Message, Client } = require("discord.js");
const Discord = require("discord.js")
const ms = require('ms')
const { setTimeout } = require('timers/promises');

module.exports = {
    
    name: "mute",
    description: "Mutes the mentioned user.",
    aliases: ['m','tempmute'],
    usage: "-mute [@user] [time] [reason]",
    example: "-mute @Nobi 30m He deserved it.",
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
        .setDescription('```Unable to mute.```')

        if(message.member.roles.highest.position <= member.roles.highest.position || !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply(
            {embeds: [noEmbed], allowedMentions: {repliedUser: false}})
          
    const reason = args.splice(2).join(' ') || "No Reason";

    try {
    var rawTime = args[1];
    var time = ms(rawTime)
    } catch(err) {
                const missingTime = new Discord.MessageEmbed()
                .setDescription('```Insert a valid mute time.```') 

                return message.reply({ embeds: [missingTime], allowedMentions: {repliedUser: false}})
}

    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
    if (!role) {
       role = await message.guild.roles.create({
            name: "muted",
            permissions: []
        })
    }
        message.guild.channels.cache.forEach(async (channel, id) => {
            await channel.permissionOverwrites.create(role, {
                SEND_MESSAGES: false,
                SPEAK: false,
                ADD_REACTIONS: false,
            })
        })

    member.roles.set([role])

    const mutedEmbed = new Discord.MessageEmbed()
    .setTitle('User Muted')
    .setDescription('The mentioned user has been muted')
    .addFields(
        {name: 'Action', value: 'Mute', inline: true},
        {name: 'User', value: member.toString(), inline: true},
        {name: 'Requested', value: message.author.tag, inline: true},
        {name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: true}
    )
    .setFooter(`Expires in ${rawTime}`)
    await message.reply({embeds: [mutedEmbed], allowedMentions: {repliedUser: false}})

    const directEmbed = new Discord.MessageEmbed()
    .setTitle('Mute Notice')
    .setDescription(`You've been punished in ${message.guild.name}.`)
    .addFields(
        {name: 'Action', value: 'Mute', inline: true},
        {name: 'Requested', value: message.author.tag, inline: true},
        {name: 'Reason', value: `\`\`\`${reason}\`\`\``, inline: true}
    )
    .setFooter(`Expires in ${rawTime}`)
    await member.send({embeds: [directEmbed], allowedMentions: {repliedUser: false}})
    
    const timeEmbed = new Discord.MessageEmbed()
    .setTitle('Mute Appealed')
    .setDescription('Your punishment has been appealed.')
    .addField('Server',`\`\`\`${message.guild.name}\`\`\``)
    .setFooter('Try not to get muted next time.')

    await setTimeout(time)
    await member.roles.remove(role)
    await member.send({embeds: [timeEmbed], allowedMentions: {repliedUser: false}})

    }
    
}