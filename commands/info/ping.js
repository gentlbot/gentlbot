const { Message, Client } = require("discord.js");
const Discord = require("discord.js")

module.exports = {
    name: "ping",
    description: "Returns the latency.",
    aliases: ['uptime'],
    usage: "-ping",
    example: "-ping",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const msg = new Discord.MessageEmbed()
            .setDescription(`🏓 Pinging...`)
            .setFooter("Fetching Data...")
             
             let hours = Math.floor(client.uptime / 3600000);
             let minutes = Math.floor(client.uptime / 60000) % 60;
             let seconds = Math.floor(client.uptime / 1000) % 60;

            var Msg = await message.reply({embeds: [msg] , allowedMentions: {repliedUser: false}});

            let x = new Discord.MessageEmbed()
            .setTitle('🏓 Pong')
            .addFields(
                { name: 'API', value: `${Math.round(client.ws.ping)}ms`, inline: true },
                { name: 'Latency', value: `${Math.floor(Msg.createdAt - message.createdAt)}ms`, inline: true },
                { name: 'Uptime', value: `${hours}h ${minutes}m ${seconds}s`, inline: true}
            )
            .setFooter(`Here's what I feteched.`)
            
            Msg.edit({ embeds: [x]});
    },
};
