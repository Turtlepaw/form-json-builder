import { KVNamespace, PagesFunction } from "@cloudflare/workers-types";
import { v4 } from "uuid";

interface Env {
    TEMPLATES: KVNamespace;
}

export const jsonResponse = (value: any, init: ResponseInit = {}) =>
    new Response(JSON.stringify(value), {
        headers: { "Content-Type": "application/json", ...init.headers },
        ...init,
    });

function getParameterByName(name: string, url: string) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//http://127.0.0.1:8788/app?name=Example Form&data={ "message": { "content": "Fill out the form below", "embeds": [] }, "forms": [ { "webhook_url": "", "button": { "label": "Open Form", "style": 1 }, "modal": { "title": "Example Form", "components": [ { "type": 1, "components": [ { "type": 4, "label": "Example Text Input", "style": "1", "placeholder": "Write text here", "value": "", "min_length": 0, "max_length": 1024, "required": true } ] } ] } } ] }&description=Example form to help you get started!&official=true&options=[{ "type": "array", "dataName": "forms", "dataSelection": "webhook_url" }]
export const onRequestPut: PagesFunction<Env> = async (context) => {
    const requestBody = context.request.url.includes("?") ? {
        data: getParameterByName("data", context.request.url),
        name: getParameterByName("name", context.request.url),
        description: getParameterByName("description", context.request.url),
        downloadOnly: getParameterByName("downloadOnly", context.request.url) ?? false,
        approved: false,
        official: Boolean(getParameterByName("official", context.request.url)),
        options: JSON.parse(`{ "data": ${getParameterByName("options", context.request.url)} }`).data,
        id: v4()
    } : null;

    if (requestBody == null) return;
    await context.env.TEMPLATES.put(requestBody.id, JSON.stringify(requestBody));
    return jsonResponse(
        await context.env.TEMPLATES.get(requestBody.id), {
        status: 200
    });
}
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const requestBody = context.request.url.includes("?") ? {
        id: getParameterByName("id", context.request.url)
    } : null;

    if (requestBody == null) return jsonResponse(
        await Promise.all((await context.env.TEMPLATES.list()).keys.map(i => context.env.TEMPLATES.get(i.name))), {
        status: 200
    });

    return jsonResponse(
        await context.env.TEMPLATES.get(requestBody.id), {
        status: 200
    });
}

