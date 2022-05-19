class REST {
    /**
     * @private
     */
    Authorization(){
        const auth = `Bot ${process.env.REACT_APP_BOT_TOKEN}`;
        return {
            'Authorization': auth
        };
    }

    /**
     * @private
    */
    Header(options){
        const headers = new Headers();

        for(const k of Object.keys(options)) headers.append(k, options[k]);

        return headers;
    }

    async post(Route, options){
        return await fetch(Route, {
            body: JSON.stringify(options.body),
            headers: this.Header({
                ...this.Authorization(),
                "Content-Type": "application/json"
            }),
            method: 'POST',
            mode: 'no-cors'
        });
    }

    async get(Route){
        return await fetch(Route, {
            headers: this.Header({
                ...this.Authorization()
            }),
            body: null,
            method: 'GET',
            mode: 'no-cors'
        });
    }

    async put(Route, options){
        return await (await fetch(Route, {
            body: JSON.stringify(options.body),
            headers: this.Header({
                ...this.Authorization(),
                "Content-Type": "application/json"
            }),
            method: 'PUT',
            mode: 'no-cors'
        })).json();
    }
}

const RouteBase = "https://discord.com/api/v10";
const Routes = {
    channelMessages: (channelId) => `${RouteBase}/channels/${channelId}/messages`,
}

export const Rest = new REST();

export async function sendForm(Json){
    const json = JSON.parse(Json);

    const body = {
        content: json.location.message.content
    }
    console.log(Routes.channelMessages(json.location.channel_id), json.location.channel_id)
    const res = await Rest.post(Routes.channelMessages(json.location.channel_id), {
        body
    });

    return res;
}
