import App from "./App";
import http from "http";
import SlackService from "./services/slack";


class Server {

    private static serverInstance: Server;
    private server: any;
    readonly port: number;

    public static bootstrap(): Server {
        if (!this.serverInstance) {
            this.serverInstance = new Server();
            return this.serverInstance;
        } else {
            return  this.serverInstance;
        }
    }

    public constructor() {
        this.port = typeof process.env.PORT === "string" ? parseFloat(process.env.PORT) : 3000;
        this.runServer();
    }

    public runServer() {
        App.set('port', this.port);

        this.createServer();

        if (this.getEnvStatus() === "prod") {
            this.bootMessage();
        }
    }

    private createServer(): void {
        this.server = http.createServer(App);
        this.server.listen(this.port, () => {
            console.log('Server listening to port: ' + this.port);
        });
    }

    public bootMessage() {
        if ('SLACK_TOKEN' in process.env) {
            if (typeof process.env.SLACK_TOKEN === "string") {
                SlackService.sendMsg({
                    channel: 'affiliate-engine',
                    username: 'Deployment Bot',
                    text: 'Affiliate Engine Re-initialized!',
                    token: process.env.SLACK_TOKEN,
                });

                return;
            }
        }

        console.log('============ No Slack Token Found ============ ');
        process.exit(500);
    }

    private getEnvStatus(): string {
        if ('ENV' in process.env) {
            if (typeof process.env.ENV === "string") {
                return process.env.ENV;
            }
        }

        console.log('============ No Env Found ============ ');
        process.exit(500);
    }
}

export const server = Server.bootstrap();
