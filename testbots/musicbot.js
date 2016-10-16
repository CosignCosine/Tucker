var Discord = require('discord.js');
var client = new Discord.Client();
var conecton = false;
client.on("ready", function(message){
    client.joinVoiceChannel("237260762681311242", function(error, connection){
        if(!conecton){
            client.sendMessage("210944343907762177", "Joined 237260762681311242 and I will play");
            conecton = !conecton;
        connection.setVolume(1.0);
        connection.playFile("test.mp3", {}, function(err){
            console.log(err);
            client.sendMessage(message, err);
        });
}
    });
});
client.on("message", function(message){
	if(message.content === "kill_bot"){
        client.logout();
    }
});
client.loginWithToken("redacted");
