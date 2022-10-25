const {fetch} = require("undici");
const WebSocket = require("ws");
const Fs = require("fs");

const {Messages} = require("./js/Messages");

const DotEnv = require("dotenv");
DotEnv.config();

const TOKEN = process.env.TOKEN;
const CHANNEL_IDS = process.env.CHANNEL_IDS.split(",");

Fs.readFile("replies.txt", (err, data) => {

    const REPLIES_LIST = data.toString().split("\n")

    function connect() {

        var ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
        var interval;

        ws.on("open", () => {

            ws.send(JSON.stringify({
                "op": 2,
                "d": {
                    "token": TOKEN,
                    "properties": {
                        "os": "linux",
                        "browser": "chrome"
                    }
                }
            }))

        })


        ws.on("message", (data) => {

            var json = JSON.parse(data);

            var {op, t, d} = json;

            if (op == 10) {
                interval = d.heartbeat_interval;
                setInterval(ms => {
                    ws.send(JSON.stringify({
                    op: 1,
                    d: null
                    }))
                }, interval)
            }

            switch (t) {

                case "MESSAGE_CREATE":

                    var reply = false;

                    if (d.author.id != "768181277814685706") {

                        if (CHANNEL_IDS.includes("ALL")) {
                            reply = true;
                        }

                        else if (CHANNEL_IDS.includes("DM") && d.guild_id == undefined) {
                            reply = true;
                        }

                        else if (CHANNEL_IDS.includes("GUILD") && d.guild_id != undefined) {
                            reply = true;
                        }

                        else if (CHANNEL_IDS.includes(d.channel_id)) {
                            reply = true;
                        }

                        else {
                            for (var i = 0; i <= CHANNEL_IDS.length - 1; i++) {
                                if (CHANNEL_IDS[i].startsWith("G") && CHANNEL_IDS[i].replace("G", "") == d.guild_id) {
                                    reply = true;
                                }
                            }
                        }


                        if (reply) {
                            setTimeout(() => {
                                Messages.sendWithTyping(REPLIES_LIST[Math.floor((Math.random() * REPLIES_LIST.length))], TOKEN, d.channel_id).then()
                            }, d.content.length * 50 * (Math.random() + 0.5))
                        }

                    }

                    break;

            }
            
        })

        ws.on("close", connect);

    }

    connect();

})
