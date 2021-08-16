const { Client, Message} = require('discord.js');
const Discord = require('discord.js')

module.exports = {
    name: "help",
    description: "Shows a command list.",
    aliases: [""],
    usage: "-help or -help [command]",
    example: "-help ping",

    /**
     *  @param {Client} client
     *  @param {Message} message
     *  @param {String[]} args
     */
    run: async (client, message, args) => {
        
        if (!args[0]) {
        const directories = [...new Set(client.commands.map((cmd) => cmd.directory)),];

        const formatString = (str) =>
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = client.commands
                .filter((cmd) => cmd.directory === dir)
                .map((cmd) => {
                    return {
                        name: cmd.name || "none",
                        description: cmd.description || "none",
                    };
                });

            return {
                directory: formatString(dir),
                commands: getCommands,
            }
        });

        const embed = new Discord.MessageEmbed()
        .setTitle('Help')
        .setDescription("Choose a Category")
        .setFooter('Use -help [command] for command details. ')
       
        const components = (state) => [
            new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId("Help")
                .setPlaceholder('Select a Category')
                .setDisabled(state)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label: cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            description: `Commands from the ${cmd.directory} category`,
                        };
                    })
                )

            )
        ];
        const initialMessage = await message.reply(
            { embeds: [embed], allowedMentions: {repliedUser: false}, components: components(false)}
        );

        const filter = (interaction) =>
            interaction.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector({ 
            filter,
            componentType: "SELECT_MENU",
            //time: 5000,
        });

        collector.on('collect', (interaction) => {
            const [ directory ] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

                if (directory === 'info') {
                    
                    const categoryEmbed = new Discord.MessageEmbed()
                .setTitle('Info Commands')
                .setDescription('List of Commands')
                .setFooter('Use -help [command] for command details. ')
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description,
                            inline: true
                    };
                })
            )

            interaction.update({embeds: [categoryEmbed]})

                }else if (directory === "dev" && interaction.user.id === client.config.owner){
                    const categoryEmbed = new Discord.MessageEmbed()
                    .setTitle('Dev Commands')
                    .setDescription('List of Commands')
                    .setFooter('Use -help [command] for command details. ')
                    .addFields(
                        category.commands.map((cmd) => {
                            return {
                                name: `\`${cmd.name}\``,
                                value: cmd.description,
                                inline: true
                        };
                    })
                    
                )
    
                interaction.update({embeds: [categoryEmbed]})
                } else if (directory === "moderation"){
                    const categoryEmbed = new Discord.MessageEmbed()
                    .setTitle('Moderation Commands')
                    .setDescription('List of Commands')
                    .setFooter('Use -help [command] for command details. ')
                    .addFields(
                        category.commands.map((cmd) => {
                            return {
                                name: `\`${cmd.name}\``,
                                value: cmd.description,
                                inline: true
                        };
                    })
                    
                )
    
                interaction.update({embeds: [categoryEmbed]})
                }else {
                    const embed = new Discord.MessageEmbed()
                    .setDescription('```You don\'t have the required permission.```')
                    return message.reply({embeds: [embed] , allowedMentions: {repliedUser: false}});
                }
        });

        collector.on('end', () => {
            initialMessage.edit({ components: components(true)});
        })
    } else{
        let cmd = args[0];

        if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {
            let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
            let name = (command.name); 
            let desc = (command.description);
            let aliases = (command.aliases.join(", ") ? command.aliases.join(", ") : "none");
            let usage = command.usage ? command.usage : "none";
            let example = command.example ? command.example : "none";
            let permissions = command.permissions ? command.permissions : "none";
            
            let embed = new Discord.MessageEmbed()
            .setTitle(name)
            .setDescription(desc)
            .setFooter("Here's what I fetched.")
            .addField("Aliases", aliases, true)
            .addField("Usage", usage, true)
            .addField("Example", example, true)
            .addField("Permissions", (`\`\`\`${permissions}\`\`\``), true)
            
            return message.reply({embeds: [embed] , allowedMentions: {repliedUser: false}});
          } else {
              let embed = new Discord.MessageEmbed()
              .setDescription('```Command could not be found.```')

            return message.reply({embeds: [embed] , allowedMentions: {repliedUser: false}});
          }
        }
    },
};