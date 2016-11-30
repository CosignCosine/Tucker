/**
 * Tucker Bot
 * created by Blaze (ct200224) and Eytukan
 * 
 * Open source version! :) :D :D :D :D
 * 
 * Most complicated RegExp used to clean (so far): message\.content\.substr\(0, \d\) === "(!(?:\w+)\W*)" replace with contentBegins(message, "$1")
 * 
 * Cleaned the data.JSON file and fixed wrong kanames
 */
requirements: {
    var Discord = require("discord.js");
    var fs = require("fs");
    var request = require("request");
    //var google = require('googleapis');
    var youtubedl = require('youtube-dl');
    //var youtub = google.youtube('v3'); //required for specific requests
    var ffmpeg = require('fluent-ffmpeg');
    var kanix = require('./kanix.js');
}

//root
function censor(censor) { //http://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
    var i = 0;

    return function(key, value) {
        if (i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
            return '[Circular]';

        if (i >= 29) // seems to be a harded maximum of 30 serialized objects?
            return '[Unknown]';

        ++i; // so we know we aren't using the original object anymore

        return value;
    }
}

function log(data) {
    console.log("[TuckerNodeFramework " + ver + ": " + data + "]");
}

function output(data) {
    console.log("[TuckerNodeFramework " + ver + ": Output: " + data + "]");
}

function contentHas(_message, regex) {
    return _message.content.match(regex);
}

function contentBegins(_message, beginning) {
    return _message.content.substr(0, beginning.length) === beginning;
}

function send(where, content) {
    Client.sendMessage(where, content);
} //shortcut ;)

initial_variables_and_constants_and_functions: {
    var killIt = false;
    var ido = "210923273553313792";
    var read = 'data.json';
    var data = JSON.parse(fs.readFileSync(read, 'utf8'));
    var _data;
    var Client = new Discord.Client();
    var messageTotal = 0;
    var ver = "v1.0";
    var blazeIsStreaming = false;
    var mostRecentChange = "Features from old Tucker bot are implemented, code made open-source."; //I accidentally put the entire source to npm in the code. oops
    var killed = false;
    var moveToTimeout = 0;
    var killTimer = 0;
    var apiCooldown = 0;
    var frameCount = 0;
    var sin = Math.sin;
    var cos = Math.cos;
    var tan = Math.tan;
    var floor = Math.floor;
    var ceil = Math.ceil;
    var queue = [];
    var numbers = 0;
    //var auth = 'redacted';//my api key for google apis
    //google.client.setApiKey(auth); //necessary to do anything
    var Harambe = "Innocent",
        Eytukan = "literally a mistake",
        Tariq = "math wizard?",
        KonurPapa = "sarcasm overload. :konur:",
        RK = "RK. What is there to say about him?",
        DU = "I dunno.",
        Blaze = "never here... :sob:",
        Element118 = {
            valueOf: function() {
                return 118;
            },
            toString: function() {
                return "Hahaha";
            }
        },
        my_life = "lonely, depressed, filled with anxiety... what is there to say ;)"; // fun eval return statements because why not
    var messageData = null;
    var badges = [];
    //for factorial maybe we could get a BigNumber node module because of how fast it grows
    function factorial(n) {
        for (var m = 1; n > 0; n--) { 
            m *= n; 
        }
        return m;
    }
    //gets and simplifies the radical of any number (only square roots)
    function radical(n) {
        if (n === 1) {
            return 1;
        } else if (n === 0) {
            return 0;
        } else if (n < 0) {
            return "boi i don't do imaginary numbers";
        }

        var coefficient = 1;
        var radical = n;

        for (var i = 2; i * i <= n; i++) {
            while (radical % (i * i) === 0) {
                radical /= i * i;
                coefficient *= i;
            }
        }
        if (coefficient === 1) {
            return "√(" + radical + ")";
        } else if (radical === 1) { 
            return coefficient;
        } else {
            return coefficient + "√(" + radical + ")";
        }
    }
    //all blocked text in the !eval command
    var blockedRegex = [
        /[^0-9]\.[^0-9]/, //Any use of decimal point that's not in a number. Could be \D\.\D
        /<(\w+)>/,
        /Client/, 
        /Date/, 
        /Discord/,
        /Array/,
        /Set/,
        /Math/,
        /Number/,
        /Map/,
        /Object/,
        /Symbol/,
        /new/,
        /function/i,
        /fromCharCode/,
        /with/,
        /fs/,
        /request/,
        /constructor/,
        /process/,
        /while/,
        /for/,
        /writeFile/,
        /send/,
        /prototype/,
        /exit/,
        /require/,
        /eval/,
        /message/,
        /__evaluation/,
        /\"/,
        /\+=/,
        /-=/,
        /\*=/,
        /\/=/,
        /{/,
        /=>/,
        /\[/,
        /\?/,
        /",/,
        /;/,
        /\(\)/,
        /\(\"/,
    ];
}

documentation: {
    var documentation = {
        "info": "This command returns helpful information regarding the bot, such as the version number.\n\n*Usage:* `!info`",
        "help": "I'm sure you know how to use this command.\n\n*Usage:* `!help [command]`",
        "eval": "Evaluates an expression. No parenthesis. We all know you want to hack.\n\n*Usage:* `!eval <expression>`",
        "learn": "Says something encouraging in chat. `Alias: *ycla*, *youcanlearnanything*`\n\n*Usage:* `!learn`",
        "ycla": "Says something encouraging in chat. `Alias: *learn*, *youcanlearnanything*`\n\n*Usage:* `!ycla`",
        "youcanlearnanything": "Says something encouraging in chat. `Alias: *ycla*, *learn*`\n\n*Usage:* `!youcanlearnanything`",
        "addquote": "Adds a user quote. This is only available for Guardians to use. `Alias: *aq*`\n\n*Usage:* `!aq \"<user>\" <quote>`",
        "aq": "Adds a user quote. This is only available for Guardians to use. `Alias: *addquote*`\n\n*Usage:* `!addquote \"<user>\" <quote>`",
        "ud": "Gets user data for a specified username on KA. Don't spam this command. `Alias: *userdata*`\n\n*Usage:* `!ud <kausername>`",
        "userdata": "Gets user data for a specified username on KA. Don't spam this command. `Alias: *ud*`\n\n*Usage:* `!userdata <kausername>`",
        "pd": "Gets program data for a specified 10- or 16- digit program number on KA. Don't spam this command. `Alias: *programdata*`\n\n*Usage:* `!pd <10- or 16-digit program number>`",
        "programdata": "Gets program data for a specified 10- or 16- digit program number on KA. Don't spam this command. `Alias: *pd*`\n\n*Usage:* `!programdata <10- or 16-digit program number>`",
        "badge": "Gets badge information for a specified KA badge. Don't spam this command.\n\n*Usage:* `!badge <badgename>`",
        "kaname": "Gets a specified Discord user's KA name. To add your KA name, use the !addid command.\n\n*Usage:* `!kaname <mentionuser>`",
        "addid": "Adds your specified KA username to this bot's database. Query it with the !kaname command.\n\n*Usage:* `!addid <yourkausername>`",
        "check": "Checks if a KA username is already taken. Don't spam this command.\n\n*Usage:* `!check <username>`",
        "afk": "Toggles AFK on/off.\n\n*Usage:* `!afk`",
        "g": "Searches google for a specified result. `Alias: *goog*, *google*`\n\n*Usage:* `!g <query>`",
        "goog": "Searches google for a specified result. `Alias: *g*, *google*`\n\n*Usage:* `!goog <query>`",
        "google": "Searches google for a specified result. `Alias: *g*, *goog*`\n\n*Usage:* `!google <query>`",
        "ban": "Bans a user. Unban with !unban. Only available for the Guardian role.",
        "softban": "Softbans a user. Unban with !unsoftban. Only available for the Guardian role.",
        "unban": "Unbans a user. Ban with !ban. Only available for the Guardian role.",
        "unsoftban": "Unsoftbans a user. Softban with !softban. Only available for the Guardian role.",
        "kick": "Kicks a user from chat. They can rejoin with a new invite, though. Only available for the Guardian role.",
        "8ball": "Runs an 8-Ball on a question. Don't spam, please!\n\n*Usage:* `!8ball [question]`",
        "promoted": "Shows the currently promoted program.\n\n*Usage:* `!promoted`",
        "promote": "Sends a request for a specified program to be promoted.\n\n*Usage:* `!promote <programnumber>`",
        "ping": "Pings the bot.\n\n*Usage:* `!ping`",
        "ask": "Asks the bot a direct question.\n\n*Usage:* `!ask`" // Feature in prograss by KonurPapa
    };
}

try {

    //checkpoint: on_load
    log("Bot started. Running node.js + discord.js ; fs.js");
    Client.on("ready", function() {
        send(Client.channels.get("id", "211634505562324992"), "@Blaze, ***Online***");
        if (blazeIsStreaming) {
            Client.setStreaming("streaming Blaze programming me!", "https://twitch.tv/blazeprogramming", 1);
        }
    });

    //checkpoint: bot_on_message
    Client.on("message", function(message) {

        //Blocked: discord.gg links
        if (contentHas(message, /discord\.gg/gim) && message.author.id !== Client.user.id) {
            Client.deleteMessage(message);
        }
        console.log(message.author.id, Client.user.id);
        //Talk Through Bot feature
        if (message.channel.id === "225050899641270272" && message.author.id !== Client.user.id) {
            if (contentBegins(message, "setchannel ")) {
                var aq = message.content.substr("setchannel ".length, message.content.length);
                ido = aq;
                send("225050899641270272", "Gotcha.");
            } else {
                send(Client.channels.get("id", ido), message.content);
            }
        } // NOOOOOOOOOOOOOOOOOOO

        //"AI" feature that basically got abandoned
        if (message.cleanContent.substr(0, "@Tucker#9402".length) === "@Tucker#9402") {
            var Greetings = [
                "Hello.",
                "Hiya.",
                "Hey",
                "Heya",
                "Sup.",
                "SAAAWWWWWW DUDE!",
                "Yo."
            ];
            var Responses = [
                "Pretty good, you?",
                "I'm doing fine. How about you?",
                "Eh. Could be better. You?",
                "I'm doing awesome! As in really awesome! How are you doing?",
                "You know that feeling when you could really go for chips and guacamole...? Anyway, enough with my personal desires. How are you doing?",
                "I'm just living the good life.... You?",
                "Happy as can be! You?",
                "Hey! Every day's a new day! I'm going fine. You?",
                "I'm just sleepy, lol. How are you doing this fine day?"
            ];
            var HowAreYou = [
                "OK, gotcha.",
                "Noted.",
                "OK!",
                "Okay!"
            ];
            var Randomness = [
                "Blaze made me. Idk what else to say except that he is overly controlling.",
                "I can't make good puns. I just am not punny enough.",
                ".-.",
                "I like okra when I don't have to eat it.",
                "I really don't have anything special to say",
                "Using the `!eval` command the wrong way makes me suicidal.",
                "I have many friends, but my friends do not have many I's.",
                "ye",
                ":1"
            ];
            var QuestionAnswers = [
                "Yes",
                "No",
                "Sure",
                "Maybe",
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                "Broccoli",
                "travel through time, the year is 1910 and you're on a train. don't push, the train is moving forward, and what are you doing on the train's roof? when its slows down, the children and women hop on. hey when this stops we can play at my house. is it in the next town? its here on the train, we live in the last wagon so hang tight because it's speeding up. 200 years of proudly being mexican. federal government"
            ];

            killIt = false;
            var a = message.cleanContent.substr("@Tucker#9402".length, message.cleanContent.length);
            a = a.replace(/\.!\?/gim, "");
            var randOfTheDay = Math.floor(Math.random() * Greetings.length);
            if ((/hello|hi|hey|heya|sup|yo[^u]/gi).test(a)) {
                send(message, Greetings[randOfTheDay]);
                killIt = true;
            }
            randOfTheDay = Math.floor(Math.random() * Responses.length);
            if ((/how/gi).test(a) && (/you doing|are you|going/gi).test(a) && !killIt) {
                send(message, Responses[randOfTheDay]);
                killIt = true;
            }
            randOfTheDay = Math.floor(Math.random() * HowAreYou.length);
            if ((/fine|good|bad|okay|nice|awesome|amazing|great/gi).test(a) && !killIt) {
                send(message, HowAreYou[randOfTheDay]);
                killIt = true;
            }
            randOfTheDay = Math.floor(Math.random() * Randomness.length);
            if ((/to say about yourself|describe yourself|about yourself|thoughts/gi).test(a) && !killIt) {
                send(message, Randomness[randOfTheDay]);
                killIt = true;
            }
            if ((/Who\'s your girlfriend|Who is your girlfriend|Who\'s your boyfriend|Who is your boyfriend/gim).test(a) && !killIt) {
                send(message, "My girlfriend's name is Beatrix and my boyfriend's name is Cameron. Hey, who said we had to love each other like that?! EW...");
                killIt = true;
            }
            if ((/my boyfriend|my girlfriend|your boyfriend|your girlfriend/gim).test(a) && !killIt) {
                send(message, "Sorry, I'm taken. <3");
                killIt = true;
            }
            randOfTheDay = Math.floor(Math.random() * QuestionAnswers.length);
            if ((/yes or no|on a scale from|guess what|what|how|why|when|who|whom/gim).test(a) && !killIt) {
                send(message, QuestionAnswers[randOfTheDay]);
                killIt = true;
            } //heh ikr
            if ((/favorite|favourite/gim).test(a) && !killIt) {
                if ((/song|music|genre/gim).test(a) && !killIt) {
                    send(message, "I like Blaze's electronic music. But hey, I'm biased.");
                    killIt = true;
                }
                if ((/program|programme/gim).test(a) && !killIt) {
                    send(message, "I like DY's \"Pamela\" a lot. I mean, it's awesome!!");
                    killIt = true;
                }
                if ((/sport/gim).test(a) && !killIt) {
                    send(message, "Football, duh! Go MSU!");
                    killIt = true;
                }
                if ((/video game/gim).test(a) && !killIt) {
                    send(message, "Portal 2 is fun, but I also like Overwatch... then again, there's this Batman game I like.... I don't know.");
                    killIt = true;
                }
                if ((/game/gim).test(a) && !killIt) {
                    send(message, "Ever played Hopscotch?");
                    killIt = true;
                }
                if ((/person/gim).test(a) && !killIt) {
                    send(message, "Blaze! I do like my girlfriend, though...");
                    killIt = true;
                }
                if ((/presidential candidate|president|wife|guy|command|player/gim).test(a) && !killIt) {
                    send(message, "No comment.... :3");
                    killIt = true;
                }
            }
        }

        //Logging system
        if (message.channel.id !== "211634505562324992" && message.channel.id !== "211634505562324992") {
            var jf = message.cleanContent;
            var cD = new Date(message.timestamp).toUTCString();
            //pushDataToRanks(message.author, Math.random()*15 + 20);
            send("211634505562324992", "\uD83D\uDD51 **" + message.author.username + "#" + message.author.discriminator + "** said \"" + jf + "\" in **" + message.channel + "** at **" + cD + "**");
            log("Chat message logged at " + cD);
        }

        //Commands!
        if (!killed) {

            //logging # of commands
            if (message.content.substr(0, 1) === "!") {
                messageTotal++;
                if (message.channel.id !== "210944343907762177") {
                    moveToTimeout += 8000;
                    _data = message;
                    if (moveToTimeout > 8000) {
                        send(_data, _data.author + ", Please move to <#210944343907762177> with bot commands. It really spams me and everyone else.");
                    }
                }
            }
            var contented = "";
            var endsub = function(numero) {
                numero = typeof numero === "number" ? numero : numero.length;
                contented = message.content.substr(0, numero);
                return message.content.substr(numero, message.content.length);
            }; //even better

            var cutoffExtra = function() {
                contented = endsub(contented.length);
            };
            switch (message.content) {
                case "shell" + endsub(5):
                    send(message, kanix(message.content.substr(6, message.content.length)));
                case "!info" + endsub(5):
                    Client.reply(message, "\n\uD83D\uDCE3 **Tucker Bot**\nRunning *TuckerNodeFramework " + ver + "*\nRunning via *node.js*, *fs.js*, and *request.js*\nCommands recieved this session: " + messageTotal + "\nChanges from previous version: " + mostRecentChange + "\nHosted on Cloud9 (https://www.c9.io/)");
                    log("Command \"info\" typed.");
                    break;

                case "!learn" + endsub(6):
                case "!ycla" + endsub(5):
                case "!youcanlearnanything" + endsub(20):
                    send(message, "\uD83D\uDCE3 You can learn anything! https://www.khanacademy.org/youcanlearnanything");
                    log("Command \"learn\", \"ycla\" or \"youcanlearnanything\" typed.");
                    break;
                case "!kill" + endsub(5):
                    if (message.author.id === "188350850530410497" || message.author.id === "198942810571931649") {
                        send(message, "Bot killed. Reloading in 30 seconds.");
                        killed = true;
                        messageData = message;
                    } else {
                        send(message, "I don't think you can use that command. If you can become Blaze, sure, why not.");
                    }
                    break;
                case "!promoted" + endsub(9):
                    var data = JSON.parse(fs.readFileSync(read, 'utf8'));
                    send(message, "**__Promoted Program__**\nhttps://www.khanacademy.org/cs/i/" + data.promoted);
                    break;
                case "!afk" + endsub(4):
                    log("Command \"afk\" typed.");
                    var afk = message.server.roles.get("name", "AFK");
                    if (afk) {
                        if (Client.userHasRole(message.author, afk)) {
                            Client.removeUserFromRole(message.author, afk);
                        } else {
                            Client.addUserToRole(message.author, afk);
                        }
                    }
                    break;
                case "!blank" + endsub(6):
                    send(message, "\"\u007F\"");
                    break;
                case "-blaze !streaming" + endsub(17):
                    log("Blaze is streaming!!");
                    if (message.author.id == "198942810571931649") {
                        blazeIsStreaming = !blazeIsStreaming;
                        var general = message.server.channels.get("name", "general");
                    }
                    break;
                case "!ping" + endsub(5):
                    {
                        var f0 = new Date(message.timestamp).valueOf();
                        var f1 = Date.now();
                        var rage = f1 - f0;
                        send(message, "Ping! " + rage + "ms.");

                    }
                    break;
                case "!lennychain" + endsub(11):
                    {
                        send(message, "\u0000\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0020\u0020\u0020\u0020\u0028\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0020\u0020\u0020\u0028\u0020\u0020\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0020\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0020\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u0020\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u000A\u0020\u0020\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u0020\u0020\u0361\u00B0\u0020\u0029\u000A\u0020\u0020\u0020\u0020\u0028\u0020\u0020\u0020\u0361\u00B0\u0020\u035C\u0296\u0020\u0361\u00B0\u0020\u0029\u00B0\u0020\u0029\u000A");
                    }
                    break;
                case "!promote" + endsub("!promote.length"):
                    var Administrator = message.server.roles.get("name", "Moderator");
                    if (!Administrator) break;
                    if (Client.userHasRole(message.author, Administrator)) {
                        var pp = message.content.substr(9, message.content.length);
                        var data = JSON.parse(fs.readFileSync(read, 'utf8'));
                        data.promoted = pp;
                        data = JSON.stringify(data);
                        fs.writeFile(read, data, function(err) {
                            if (err) return console.log(err);
                            output("Data has been successfully pushed to tucker/data.json");
                            send(message, "Good job! Your program has been promoted.");
                        });
                    } else {
                        send(message, "<@198942810571931649>, " + message.author + " desires to promote a program. Please evaluate the program and then feel free to add or deny it.");
                    }
                    break;
                case "!help" + endsub("!help".length):
                    var helpWith = message.content.substr(6, message.content.length);
                    if (!helpWith || helpWith.length === 0) {
                        send(message, "**Current Command List**\n```!info, !help, !eval, !learn, !ycla, !youcanlearnanything, !addquote, !aq, !pd, !programdata, !ud, !userdata, !badge, !kaname, !addid, !check, !afk, !g, !goog, !google, !8ball, !promoted, !promote, !ban, !softban, !unban, !unsoftban, !kick```\nSend `!help [command]` to learn about a specific command (put the command in question in the `[command]` space above)");
                    } else {
                        var foundResult = false;
                        for (var i in documentation) {
                            if (helpWith === i) {
                                var confuse = helpWith;
                                confuse = confuse.toLowerCase();
                                confuse = confuse.substr(0, 1).toUpperCase() + confuse.substr(1, confuse.length);
                                send(message, "**__" + confuse + " Command__**\n" + documentation[i]);
                                foundResult = true;
                            }
                        }
                        if (!foundResult) {
                            send(message, "\uD83D\uDCE3 I could not find results for that command. Perhaps you misspelled the command name or typed an invalid command?");
                        }
                    }
                    break;
                case "!eval" + endsub(5):
                    {
                        Client.startTyping(message.channel);
                        var __evaluation = message.content.substr(6, message.content.length);
                        
                        
                        
                        var codeIsBlocked = false;
                        for (var i = 0; i < blockedRegex.length; i++) {
                            if (__evaluation.match(blockedRegex[i])) {
                                codeIsBlocked = true;
                                break;
                            }
                        }
                        
                        if (codeIsBlocked) {
                            Client.reply(message, "\uD83D\uDCE3 Because of the capabilities of something that you have typed, it has been blocked in this mechanism because of the use of the `eval` command here."); //ye 
                        } else {
                            __evaluation = __evaluation.replace("pi", "Math.PI");
                            __evaluation = __evaluation.replace("π", "Math.PI");
                            __evaluation = __evaluation.replace("\We", "Math.E");
                            __evaluation = __evaluation.replace(/=/gim, "===");
                            console.log(__evaluation);
                            var retrun, evil;

                            try {
                                retrun = eval(__evaluation); //jshint ignore:line
                            } catch (e) {
                                send(message, "\uD83D\uDCE3 This evaluation gives me an error. Are you sure you typed everything correctly?");
                                evil = true;
                            }
                            if (!evil) {
                                send(message, "\uD83D\uDCE3 " + __evaluation + " evaluates to " + retrun);
                            }
                        }
                    }
                    break;
                case "!aq" + endsub(3):
                case "!addquote" + endsub(9):
                    {
                        Client.startTyping(message.channel);
                        var lf = contentBegins(message, "!aq") ? 3 : 9;
                        var lq = message.content;
                        lq = lq.substr(lf, lq.length);
                        lq = lq.split("\"");
                        Administrator = message.server.roles.get("name", "Verified");
                        if (!Administrator) break;
                        if (Client.userHasRole(message.author, Administrator)) {

                            data = JSON.parse(fs.readFileSync(read, 'utf8'));
                            if (!data.quotes[lq[1]]) {
                                data.quotes[lq[1]] = [];
                            }
                            lq[2] = lq[2].substr(1, lq[2].length);
                            data.quotes[lq[1]].push(lq[2]);
                            data = JSON.stringify(data);
                            fs.writeFile(read, data, function(err) {
                                if (err) return console.log(err);
                                output("Data has been successfully pushed to tucker/data.json");
                            });
                            send(message, "\uD83D\uDCE3 Completed process.\n```javascript\n{user: \"" + lq[1] + "\", quote: \"" + lq[2] + "\"}```");
                        } else {
                            send(message, "I'm afraid you don't have the required role to complete this action.");
                        }
                    }
                    break;
                case "!g " + endsub(3):
                case "!goog " + endsub(6):
                case "!google" + endsub(7):
                    Client.startTyping(message.channel);
                    var lf = contentBegins(message, "!g ") ? 2 : contentBegins(message, "!goog ") ? 5 : 7; //jshint ignore:line
                    var lq = message.content; //jshint ignore:line
                    lq = lq.substr(lf + 1, lq.length);
                    lq = lq.replace(/ /gim, "+");
                    send(message, "\uD83D\uDCE3 http://lmgtfy.com/?q=" + lq);
                    break;
                case "!joingroup " + endsub(11):
                    {
                        Client.startTyping(message.channel);
                        var lq = message.content; //jshint ignore:line
                        lq = lq.substr(11, lq.length);
                        data = JSON.parse(fs.readFileSync(read, 'utf8'));
                        var itExists = false;
                        var dankestOfMemes;
                        for (var i = 0; i < data.groups.length; i++) {
                            if (data.groups[i].name === lq.toLowerCase()) {
                                itExists = true;
                                dankestOfMemes = i;
                                send(message, "Found group! Joining...");
                                break;
                            }
                        }
                        if (itExists) {
                            data.groups[dankestOfMemes].people.push(message.author.id);
                            data = JSON.stringify(data);
                            fs.writeFile(read, data, function(err) {
                                if (err) return console.log(err);
                                output("Data has been successfully pushed to tucker/data.json");
                                send(message, "Done! You are now part of group `" + lq + "`");
                            });
                        } else {
                            send(message, "I couldn't find that group.");
                        }
                    }
                    break;
                case "!leavegroup" + endsub(12):
                    {
                        Client.startTyping(message.channel);
                        var lq = message.content; //jshint ignore:line
                        lq = lq.substr(12, lq.length);
                        data = JSON.parse(fs.readFileSync(read, 'utf8'));
                        var itExists = false;
                        var dankestOfMemes;
                        for (var i = 0; i < data.groups.length; i++) {
                            if (data.groups[i].name === lq.toLowerCase()) {
                                itExists = true;
                                dankestOfMemes = i;
                                send(message, "Found group! Leaving...");
                                break;
                            }
                        }
                        if (itExists) {
                            var cow = false,
                                juice = 0;
                            for (var i = 0; i < data.groups[dankestOfMemes].people.length; i++) {
                                if (message.author.id === data.groups[dankestOfMemes].people[i]) {
                                    cow = true;
                                    juice = i;
                                    break;
                                }
                            }
                            if (cow) {
                                data.groups[dankestOfMemes].people.splice(juice, 1);
                                data = JSON.stringify(data);
                                fs.writeFile(read, data, function(err) {
                                    if (err) return console.log(err);
                                    output("Data has been successfully pushed to tucker/data.json");
                                    send(message, "Done! You have now left group `" + lq + "`");
                                });
                            }
                        } else {
                            send(message, "I couldn't find that group.");
                        }
                    }
                    break;
                case "!pinggroup " + endsub(11):
                    {
                        Client.startTyping(message.channel);
                        var lq = message.content; //jshint ignore:line
                        lq = lq.substr(11, lq.length);
                        lr = lq.split("\"");
                        data = JSON.parse(fs.readFileSync(read, 'utf8'));
                        var itExists = false;
                        var dankestOfMemes;
                        for (var i = 0; i < data.groups.length; i++) {
                            if (data.groups[i].name === lr[1].toLowerCase()) {
                                itExists = true;
                                dankestOfMemes = i;
                                break;
                            }
                        }
                        if (itExists) {
                            if (data.groups[dankestOfMemes].canping.indexOf(message.author.id) !== -1) {
                                var stringity = "\uD83D\uDCE3 ";
                                for (var i = 0; i < data.groups[dankestOfMemes].people.length; i++) {
                                    stringity += "<@" + data.groups[dankestOfMemes].people[i] + "> "
                                }
                                stringity += "\n\n**ANNOUNCEMENT**\n" + lr[2] + "\n__This announcement is for the group `" + lr[1] + "`.__";
                                send(message, stringity);
                            } else {
                                send(message, "You don't have the correct permissions to ping this group.");
                            }
                        } else {
                            send(message, "I couldn't find that group.");
                        }
                    }
                    break;
                case "!8ball" + endsub("!8ball".length):
                    {
                        var replies = ["No.", "Yes.", "No.", "Yes.", "No.", "Yes.", "Perhaps.", "Results hazy; ask again.", "Ask another time.", "All speculation points to the positive response.", "All speculation is negative on this matter.", "I have a right to not tell you.", "Ya", "Na", ":| Should I tell you...?", ":1", ":1", "Stop Spamming Me Tariq"];
                        if (message.channel.id === "210944343907762177") {
                            send(message, replies[Math.floor(Math.random() * replies.length)]);
                        } else {
                            Client.reply(message, "please move to #bot-spam-and-meme for bot commands.");
                        }
                    }
                    break;
                case "!pd" + endsub("!pd".length):
                case "!programdata" + endsub("!programdata".length):
                    {
                        Client.startTyping(message.channel);
                        if (apiCooldown < 0) {
                            var lq = message.content; //jshint ignore:line
                            var lf = contentBegins(message, "!pd") ? 3 : 12; //jshint ignore:line
                            lq = lq.substr(lf + 1, lq.length);
                            lq = lq.replace(/ /gim, "");
                            var url = "https://www.khanacademy.org/api/labs/scratchpads/" + lq;
                            var __data;
                            request(url, function(error, __response, __body) {
                                if (!error && __response && __response.statusCode === 200) {
                                    __data = JSON.parse(__body);
                                    if (__data) {
                                        send(message, "__***" + __data.title + "***__\n• **Votes**: " + __data.sumVotesIncremented + "\n• **Spin-offs**: " + __data.spinoffCount + "\n• **Hidden from Hot List**: " + (__data.hideFromHotList ? "Yes" : "No") + "\n• **Flagged**: " + (__data.flags.length > 0 ? "Yes" : "No") + "\n• **Program Link**: https://www.khanacademy.org/cs/-/" + lq);
                                    }
                                } else {
                                    send(message, "\uD83D\uDCE3 I got an error while parsing this command. Please try again. Status Code **" + __response.statusCode + "**");
                                }
                            });
                            apiCooldown = 5000;
                        } else {
                            send(message, "\uD83D\uDCE3 Whoa there! You're sending WAYYYYYY too many api calls too quickly! Try again in " + Math.floor(apiCooldown / 1000) + " seconds.");
                        }
                    }
                    break;
                case "!kaname" + endsub("!kaname".length):
                    {
                        Client.startTyping(message.channel);
                        var lq = message.content; //jshint ignore: line
                        lq = lq.substr(8, lq.length);
                        lq = lq.replace("!", "");
                        data = JSON.parse(fs.readFileSync(read, 'utf8'));
                        if (data.kanames[lq]) {
                            send(message, "\uD83D\uDCE3 Here is a link to this user's profile. <https://www.khanacademy.org/profile/" + encodeURIComponent(data.kanames[lq]) + ">");
                        } else {
                            send(message, "\uD83D\uDCE3 This user does not seem to have a username on file.");
                        }
                    }
                    break;
                case "!addid" + endsub("!addid".length):
                    {
                        Client.startTyping(message.channel);
                        var __data; //jshint ignore: line
                        var lq = message.content; //jshint ignore: line
                        lq = lq.substr(7, lq.length);
                        data = JSON.parse(fs.readFileSync(read, 'utf8'));
                        data.kanames[message.author] = lq;
                        data = JSON.stringify(data);
                        fs.writeFile(read, data, function(err) {
                            if (err) return console.log(err);
                            output("Data has been successfully pushed to tucker/data.json");
                        });
                        send(message, "Yay, you are now in the database!");
                    }
                    break;
                case "... " + endsub(4):
                    {
                        var lq = message.content; //jshint ignore: line
                        lq = lq.substr(4, lq.length);

                        data = JSON.parse(fs.readFileSync(read, 'utf8'));
                        if (data.quotes[lq]) {
                            var randOfTheDay = Math.floor(Math.random() * data.quotes[lq].length);
                            send(message, "\uD83D\uDCE3 " + data.quotes[lq][randOfTheDay]);
                        } else {
                            send(message, "\uD83D\uDCE3 I can't seem to find a quote for this user. Try again?");
                        }
                    }
                    break;
                case "!check " + endsub("!check ".length):
                    {
                        Client.startTyping(message.channel);
                        if (apiCooldown < 0) {
                            var lq = message.content; //jshint ignore: line
                            lq = lq.substr(7, lq.length);
                            request("https://www.khanacademy.org/api/internal/user/username_available?username=" + lq, function(error, __response, __body) {
                                if (!error && __response && __response.statusCode === 200) {
                                    if (__body === "false") {
                                        send(message, "\uD83D\uDCE3 This username has already been taken.");
                                    } else {
                                        send(message, "\uD83D\uDCE3 You can most definitely use this username!");
                                    }
                                } else {
                                    send(message, "\uD83D\uDCE3 I got an error while parsing this command. Please try again. Status Code **" + __response.statusCode + "**");
                                }
                            });
                            apiCooldown = 5000;
                        } else {
                            send(message, "\uD83D\uDCE3 Whoa there! You're sending WAYYYYYY too many api calls too quickly! Try again in " + Math.floor(apiCooldown / 1000) + " seconds.");
                        }
                    }
                    break;
                case "!badge " + endsub("!badge ".length):
                    {
                        Client.startTyping(message.channel);
                        if (apiCooldown < 0) {
                            var lq = message.content; //jshint ignore: line
                            lq = lq.substr(7, lq.length);
                            lq = lq.toLowerCase();
                            if (badges.length === 0) {
                                request("https://www.khanacademy.org/api/v1/badges", function(error, __response, __body){
                                    if (!error && __response && __response.statusCode === 200) {
                                        var _badges = JSON.parse(__body);
                                        for (var i = 0; i < _badges.length; i++) {
                                            badges[_badges[i].description.toLowerCase()] = {
                                                name: _badges[i].description,
                                                relative_url: _badges[i].relative_url,
                                                icon: _badges[i].icons.large,
                                                description: _badges[i].translated_safe_extended_description
                                            };
                                        }
                                        if (badges[lq]) {
                                            send(message, "***__" + badges[lq].name + "__***\n" + badges[lq].description + "\n https://www.khanacademy.org" + badges[lq].relative_url + "\n " + badges[lq].icon);
                                        } else {
                                            send(message, "\uD83D\uDCE3 This badge could not be found.");
                                        }
                                    } else {
                                        send(message, "\uD83D\uDCE3 I got an error while parsing this command. Please try again. Status Code **" + __response.statusCode + "**");
                                    }
                                });
                                apiCooldown = 5000;
                            }
                        } else {
                            send(message, "\uD83D\uDCE3 Whoa there! You're sending WAYYYYYY too many api calls too quickly! Try again in " + Math.floor(apiCooldown / 1000) + " seconds.");
                        }
                    }
                    break;
                case "!ud" + endsub("!ud"):
                case "!userdata" + endsub("!userdata"):
                    {
                        Client.startTyping(message.channel);
                        if (apiCooldown < 0) {
                            var lq = message.content; //jshint ignore:line
                            var lf = contentBegins(message, "!ud") ? 3 : 9; //jshint ignore:line
                            lq = lq.substr(lf + 1, lq.length);
                            lq = lq.replace(/ /gim, "");
                            url = "https://www.khanacademy.org/api/internal/user/profile?username=" + lq + "";
                            __data;
                            request(url, function(error, __response, __body) {
                                if (__response) {
                                    if (!error && __response.statusCode === 200) {
                                        __data = JSON.parse(__body);
                                        if (__data) {
                                            send(message, "***" + __data.nickname + "***\n`" + __data.points + " Energy Points`\n\"" + __data.bio + "\"\n*Avatar:* " + __data.avatar.imageSrc + "\n*User profile:* https://www.khanacademy.org/profile/" + lq);
                                        } else {
                                            send(message, "\uD83D\uDCE3 I couldn't find that user. Are you sure you typed the username correctly?");
                                        }
                                    } else {
                                        if (__response) {
                                            send(message, "\uD83D\uDCE3 I got an error while parsing this command. Please try again. Status Code **" + __response.statusCode + "**");
                                        }
                                    }
                                }
                            });
                            apiCooldown = 5000;
                        } else {
                            send(message, "\uD83D\uDCE3 Whoa there! You're sending WAYYYYYY too many api calls too quickly! Try again in " + Math.floor(apiCooldown / 1000) + " seconds.");
                        }
                    }
                    break;
                case "!uin" + endsub("!uin"):
                    {
                        Client.startTyping(message.channel);
                        var lq = message.content;
                        var lf = 5;
                        lq = lq.substr(lf, lq.length);
                        var role = message.server.roles.get("name", lq);
                        if (!role) {
                            send(message, "This role could not be found.");
                            break;
                        } else {
                            var users = message.server.usersWithRole(role);
                            for (var i = 0; i < users.length; i++) {
                                users[i] = "**" + users[i].username + "**#" + users[i].discriminator;
                            }
                            var _users = "**__Here are the users with this role:__**\n";
                            for (i = 0; i < users.length; i++) { //idc if this is bad code
                                if (users.length === 1) {
                                    _users += users[i] + ".";
                                } else if (i === users.length - 1) {
                                    _users += "and " + users[i] + ".";
                                } else {
                                    _users += users[i] + ", ";
                                }
                            }

                            send(message, _users);
                        }
                    }
                    break;
                case "-guardian !addid" + endsub("-guardian !addid"):
                    {
                        var Administrator = message.server.roles.get("name", "Guardian");
                        if (!Administrator) break;
                        if (Client.userHasRole(message.author, Administrator)) {
                            var lq = message.content;
                            var lf = 17;
                            lq = lq.substr(lf, lq.length);
                            lq = lq.split("\"");
                            data = JSON.parse(fs.readFileSync(read, 'utf8'));
                            lq[2] = lq[2].substr(1, lq[2].length);
                            lq[1].replace(/!/gim, "");
                            data.kanames[lq[1]] = lq[2];
                            data = JSON.stringify(data);
                            fs.writeFile(read, data, function(err) {
                                if (err) return console.log(err);
                                output("Data has been successfully pushed to tucker/data.json");
                            });
                            send(message, "Yay, " + lq[1] + "'s KA name has been added to the database!");
                        } else {
                            send(message, "I'm afraid you don't have the right permissions to use this command.");
                        }
                    }
                    break;
                case "!ban " + endsub("!ban "):
                    {
                        Client.startTyping(message.channel);
                        var Administrator = message.server.roles.get("name", "Guardian");
                        if (!Administrator) break;
                        if (Client.userHasRole(message.author, Administrator)) {
                            var lq = message.content;
                            var lf = 5;
                            lq = lq.substr(lf, lq.length);
                            var lr = lq;
                            lq = lq.replace("!", "");
                            lq = lq.replace("<", "");
                            lq = lq.replace(">", "");
                            lq = lq.replace("@", "");
                            var user = message.server.members[lq];
                            for (var i in message.server.members) {
                                if (!isNaN(i * 1)) {
                                    if (message.server.members[i] && message.server.members[i].id === lq) {
                                        user = message.server.members[i];
                                    }
                                }
                            }
                            process.exit();
                            send(message, lr + " has been banned (by IP) from the server.");
                        } else {
                            send(message, "I'm afraid you don't have the right permissions to use this command.");
                        }
                    }
                    break;
                case "!unban " + endsub("!unban "):
                    {
                        Client.startTyping(message.channel);
                        var Administrator = message.server.roles.get("name", "Guardian");
                        if (!Administrator) break;
                        if (Client.userHasRole(message.author, Administrator)) {
                            var lq = message.content;
                            var lf = 7;
                            lq = lq.substr(lf, lq.length);
                            var lr = lq;
                            lq = lq.replace("!", "");
                            lq = lq.replace("<", "");
                            lq = lq.replace(">", "");
                            lq = lq.replace("@", "");
                            var user = message.server.members[lq];
                            for (i in message.server.members) {
                                if (!isNaN(i * 1)) {
                                    if (message.server.members[i] && message.server.members[i].id === lq) {
                                        user = message.server.members[i];
                                    }
                                }
                            }
                            message.server.unban(user);
                            send(message, lr + " has been unbanned from the server.");
                        } else {
                            send(message, "I'm afraid you don't have the right permissions to use this command.");
                        }
                    }
                    break;
                case "!update":
                    {
                        Client.startTyping(message.channel);
                        var Administrator = message.server.roles.get("name", "Guardian");
                        if (!Administrator) break;
                        if (Client.userHasRole(message.author, Administrator)) {
                            process.exit();
                        } else {
                            send(message, "I'm afraid you don't have the right permissions to use this command.");
                        }
                    }
                    break; // Feature in prograss by KonurPapa
                case "!google" + endsub(7):
                    var myWebRequest = WebRequest.Create(www.google.com);
                    var myWebResponse = myWebRequest.GetResponse();
                    send(message, "Answer: " + myWebResponse);
                    
                    /*Client.startTyping(message.channel);
                    var lf = contentBegins(message, "!g ") ? 2 : contentBegins(message, "!goog ") ? 5 : 7; //jshint ignore:line
                    var lq = message.content; //jshint ignore:line
                    lq = lq.substr(lf + 1, lq.length);
                    lq = lq.replace(/ /gim, "+");
                    send(message, "\uD83D\uDCE3 http://lmgtfy.com/?q=" + lq);*/
                    break;
                default: //  now you don't need these if else statements lol ikr
                    {
                        if (message.author.id !== Client.user.id) {
                            if (message.content === "ping") {
                                Client.reply(message, "pong");
                                log("Custom Reaction \"ping\" [with response \"pong\"] typed.");
                            } else if (message.content === "pong") {
                                Client.reply(message, "ping");
                                log("Custom Reaction \"pong\" [with response \"ping\"] typed.");
                            } else if (message.content === "/o/") {
                                send(message, "\\o\\");
                                log("Custom Reaction \"/o/\" [with response \"\\o\\\"] typed.");
                            } else if (message.content === "\\o\\") {
                                send(message, "/o/");
                                log("Custom Reaction \"\\o\\\" [with response \"/o/\"] typed.");
                            }
                        }
                        if (contentBegins(message, "!softban ")) {
                            Client.startTyping(message.channel);
                            Administrator = message.server.roles.get("name", "Guardian");
                            if (!Administrator) break;
                            if (Client.userHasRole(message.author, Administrator)) {
                                lq = message.content;
                                lf = 9;
                                lq = lq.substr(lf, lq.length);
                                lr = lq;
                                lq = lq.replace("!", "");
                                lq = lq.replace("<", "");
                                lq = lq.replace(">", "");
                                lq = lq.replace("@", "");
                                var softban = message.server.roles.get("name", "Soft Banned");
                                var verify = message.server.roles.get("name", "Verified User");
                                user = message.server.members[lq];
                                for (i in message.server.members) {
                                    if (!isNaN(i * 1)) {
                                        if (message.server.members[i] && message.server.members[i].id === lq) {
                                            user = message.server.members[i];
                                        }
                                    }
                                }
                                if (!user) {
                                    send(message, lr + " was not banned due to a glitch. Please try again.");
                                    break;
                                }
                                Client.addUserToRole(user, softban);
                                Client.removeUserFromRole(user, verify);
                                send(message, lr + " has been softbanned on this server.");
                            } else {
                                send(message, "I'm afraid you don't have the right permissions to use this command.");
                            }
                        } else if (message.content.substr(0, 11) === "!unsoftban ") {
                            Client.startTyping(message.channel);
                            var Administrator = message.server.roles.get("name", "Guardian");
                            if (!Administrator) break;
                            if (Client.userHasRole(message.author, Administrator)) {
                                var lq = message.content;
                                var lf = 11;
                                lq = lq.substr(lf, lq.length);
                                var lr = lq;
                                lq = lq.replace("!", "");
                                lq = lq.replace("<", "");
                                lq = lq.replace(">", "");
                                lq = lq.replace("@", "");
                                var softban = message.server.roles.get("name", "Soft Banned");
                                var user = message.server.members[lq];
                                for (var i in message.server.members) {
                                    if (!isNaN(i * 1)) {
                                        if (message.server.members[i] && message.server.members[i].id === lq) {
                                            user = message.server.members[i];
                                        }
                                    }
                                }
                                if (!user) {
                                    send(message, lr + " was not unbanned due to a glitch. Please try again.");
                                    break;
                                }
                                Client.removeUserFromRole(user, softban);
                                send(message, lr + " has been un-softbanned on this server.");
                            } else {
                                send(message, "I'm afraid you don't have the right permissions to use this command.");
                            }
                        } else if (contentBegins(message, "!kick ")) {
                            var Administrator = message.server.roles.get("name", "Guardian");
                            if (!Administrator) break;
                            if (Client.userHasRole(message.author, Administrator)) {
                                var lq = message.content;
                                var lf = 6;
                                lq = lq.substr(lf, lq.length);
                                var lr = lq;
                                lq = lq.replace("!", "");
                                lq = lq.replace("<", "");
                                lq = lq.replace(">", "");
                                lq = lq.replace("@", "");
                                var user = message.server.members[lq];
                                for (var i in message.server.members) {
                                    if (!isNaN(i * 1)) {
                                        if (message.server.members[i] && message.server.members[i].id === lq) {
                                            user = message.server.members[i];
                                        }
                                    }
                                }
                                message.server.kickMember(user, 0);
                                send(message, lr + " has been kicked from the server.");
                            } else {
                                send(message, "I'm afraid you don't have the right permissions to use this command.");
                            }
                        } else if (contentBegins(message, "!play ")) {
                            var content = message.content.substr(6, message.content.length);
                            if (content.match("youtube")) {
                                youtubedl.getInfo(content, [], function(err, info) {
                                    if (err) console.log(err);
                                    for (var i in info) {
                                        console.log(i, info[i]);
                                    }
                                    var duration = info.duration;
                                    duration = duration.split(":");
                                    if (duration.length < 2) {
                                        duration.unshift("0");
                                    }
                                    if (duration[0] * 1 > 5) { //maybe you can use the youtube API for the duration Also with the API I believe you can access safeSearch which should be good because of the age of our users
                                        //https://developers.google.com/youtube/v3/docs/search/list <--currently learning this
                                        send(message, "This song is too long to play.");
                                    } else {
                                        console.log("hi");
                                        /*
                                        var video = youtubedl(content,
                                        // Optional arguments passed to youtube-dl.
                                        ['--format=18'],
                                        // Additional options can be given for calling `child_process.execFile()`.
                                        { cwd: __dirname });
                                        queue.push("a" + numbers + ".mp4");
                                        video.on('info', function(_info) {
                                          console.log('Download started');
                                          console.log('filename: ' + _info._filename);
                                          console.log('size: ' + _info.size);
                                        });
                                        video.on('complete', function complete(info) {
                                          console.log('filename: ' + info._filename + ' already downloaded.');
                                        });
                                        video.pipe(fs.createWriteStream('videos/a' + numbers + ".mp4")); //wip TODO @Blaze
                                        numbers++
                                        */
                                        /*
                                        if(Client.voiceConnection && Client.voiceConnection.voiceChannel.id === "210923273553313793"){
                                          Client.voiceConnection.playFile("videos/" + queue[0], {}, function(){
                                            send("Now playing: ");
                                          });
                                        }else */
                                        {
                                            Client.joinVoiceChannel("210923273553313793", function() {
                                                Client.voiceConnection.playRawStream(info.url); // ;-;
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
            }
        }
        Client.stopTyping(message.channel);
    });
    Client.on("serverNewMember", (server, user) => { //is there a reason to use the arrow other than the function?
        var general = server.channels.get("name", "general");
        send(general, user + ", welcome to the chat!");
    });
    Client.on("messageDeleted", (message, channel) => {
        if (!message) {
            send("211634505562324992", "Error.");
        } else {
            var jf = message.cleanContent;
            send("211634505562324992", "\uD83D\uDD51 **" + message.author.username + "#" + message.author.discriminator + "**'s message: \"" + jf + "\" in **" + message.channel + "** was deleted.");
        }
    });
    Client.on("error", (error) => {
        send("211634505562324992", "<@198942810571931649>, I have encountered a fatal error.");
    });
    Client.on("messageUpdated", function(mess, age) {
        console.log(age.channel.id);
        if (age.channel.id === "210943602816188416") {
            send("210942312308539394", "\uD83D\uDCE3 @everyone Rules updated! Be sure to check out #info for all the new things!");
        }
        if (age.content.match(/discord\.gg/gim) && mess.author.id !== "198942810571931649" && mess.author.id !== Client.user.id) {
            Client.deleteMessage(age);
        }
        if (!mess || !age) {
            var wotd = "";
            if (!mess) {
                wotd = "Variable `mess`";
            } else {
                wotd = "Variable `age`";
            }
            send("211634505562324992", "Error. " + wotd + " not defined.");
        } else {
            var jf = mess.cleanContent;
            var jk = age.cleanContent;
            send("211634505562324992", "\uD83D\uDD51 **" + mess.author.username + "#" + mess.author.discriminator + "** updated their post: \"" + jf + "\" in **" + mess.channel + "** to \"" + jk + "\".");
            console.log("boi");
        }
    });
    var games = [
        "bodybuilding",
        "chess",
        "football",
        "Overwatch",
        "Madden Football 2K17",
        "Portal 2",
        "with Blaze",
        "violin",
        "programming",
        "rummaging in the KA API",
        "Garry's Mod",
        "being just weird",
        "with Eytoucan",
        "listening to Eytukan's sick playlists on Soundcloud",
        "listening to Blaze's sick music on SoundCloud",
        "| Type !help | Version " + ver,
        "Cory in the House",
    ];
    var statements = [
        "AAAAAYYYYYYYYYYY",
        "I'm bored :|",
        "So, what's a good conversation starter?",
        "Why am I posting right now?",
        "Overwhelming sadness— just kidding.",
        "The FitnessGram™ Pacer Test is a— you know what, that's old.",
        "Do you think I talk too much?",
        "Mao. That's about it."
    ];
    setInterval(function() {
        frameCount++;
        apiCooldown--;
        if (moveToTimeout > 0) {
            moveToTimeout--;
        }
        if (killed) {
            killTimer++;
            if (killTimer % 5000 === 0) {
                console.log("[Reloading bot... " + (killTimer * 100) / 30000 + "% complete.]");
            }
            if (killTimer > 30000) {
                killed = false;
                killTimer = 0;
                send(messageData, "Finished reloading the bot. You may go back to using commands now.");
            }
        }
        if (frameCount % 10000 === 0) {
            var randOfTheDay = Math.floor(Math.random() * games.length);
            if (blazeIsStreaming) {
                Client.setStreaming("Blaze programming me!", "https://twitch.tv/blazeprogramming", 1);
            } else {
                Client.setPlayingGame(games[randOfTheDay]);
            }
        }
    }, 1);
    Client.loginWithToken("redacted"); //remove the token when posting on github. people can use it maliciously. ik bae ;)`
} catch (error) {
    console.log(error);
}
