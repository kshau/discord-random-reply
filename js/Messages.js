const {fetch} = require("undici");

class Messages {

    static async send(content, token, channel_id) {

        await fetch(`https://discord.com/api/v9/channels/${channel_id}/messages`, {
            "headers": {
                "authorization": token,
                "content-type": "application/json"
            },
            "body": JSON.stringify({"content": content}),
            "method": "POST",
        });

    }

    static async typing(token, channel_id) {

        await fetch(`https://discord.com/api/v9/channels/${channel_id}/typing`, {
            "headers": {
                "authorization": token
            },
            "body": null,
            "method": "POST"
        });

    }

    static async sendWithTyping(content, token, channel_id) {

        Messages.typing(token, channel_id);

        setTimeout(() => {
            Messages.send(content, token, channel_id)
        }, (content.length * 200 < 10000) ? (content.length * 200) : (10000))
        
    }

}

module.exports = {Messages};