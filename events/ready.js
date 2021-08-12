const client = require("../index");

client.on("ready", () => {

const arrayOfStatus = [`${client.guilds.cache.size} servers`, "the -help command.", "your requests."];

let index = 0;
setInterval(() => {
    if(index === arrayOfStatus.length) index = 0;
    const status = arrayOfStatus[index];
    client.user.setActivity(status, {type: 'WATCHING'});
    index++;

}, 10000)


    console.log(`${client.user.tag} is up and ready to go!`)
});
