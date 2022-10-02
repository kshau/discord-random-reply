const {fetch} = require("undici");
const WebSocket = require("ws");
const Fs = require("fs");

const TOKEN = "NzY4MTgxMjc3ODE0Njg1NzA2.Glj2dn.9J7WSQslE6elSa6WSeD1avgO4qcy5w9UiE--ks";

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
                "intents": 513,
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
                    
                    if (d.author.id != "768181277814685706" || d.guild_id == "1006349856543088661") {
                        fetch(`https://discord.com/api/v9/channels/${d.channel_id}/messages`, {
                            "headers": {
                                "authorization": TOKEN,
                                "content-type": "application/json"
                            },
                            "body": JSON.stringify({"content": REPLIES_LIST[Math.floor((Math.random() * REPLIES_LIST.length))]}),
                            "method": "POST",
                        }).then();
                    }

                    break;

            }
            
        })

        ws.on("close", connect);

    }

    connect();

})
