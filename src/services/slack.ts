import {slackMessage} from "../types";
import HttpUtility from "../utilities/http";

export default class SlackService {

    static async sendMsg(message: slackMessage) {
        const {channel, username, text, token} = message;

        const url = 'https://slack.com/api/chat.postMessage?';
        const params: any =  {
            channel,
            username,
            text,
            token,
        };
        const stringedParams = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
        const request = url + stringedParams;

        await HttpUtility.httpsGet(request);
    }
}
