const { Message, Client } = require("discord.js");
const Discord = require("discord.js")

module.exports = {
    name: "ping",
    aliases: ['p'],
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
            
            var Msg = await message.channel.send({embeds: [msg] });

            let x = new Discord.MessageEmbed()
            .setTitle('🏓 Pong')
            .addFields(
                { name: 'API', value: `${Math.round(client.ws.ping)}ms`, inline: true },
                { name: 'Latency', value: `${Math.floor(Msg.createdAt - message.createdAt)}ms`, inline: true }
            )
            .setFooter(`Here's what I feteched.`)
            
            Msg.edit({ embeds: [x]});
    },
};
