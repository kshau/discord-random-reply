const {fetch} = require("undici");
const WebSocket = require("ws");
const Fs = require("fs");
const DotEnv = require("dotenv");

DotEnv.config();

const TOKEN = process.env.TOKEN;
const CHANNEL_IDS = ["953805329345429614", "1031375573504757770", "941815267187622028", "986672234607304714", "902313099749642251"]

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

                    CHANNEL_IDS.forEach(c => {

                        if (d.channel_id == c && d.author.id != "768181277814685706") {
                            fetch(`https://discord.com/api/v9/channels/${d.channel_id}/messages`, {
                                "headers": {
                                    "authorization": TOKEN,
                                    "content-type": "application/json"
                                },
                                "body": JSON.stringify({"content": REPLIES_LIST[Math.floor((Math.random() * REPLIES_LIST.length))]}),
                                "method": "POST",
                            }).then();
                        }

                    })

                    break;

            }
            
        })

        ws.on("close", connect);

    }

    connect();

})
