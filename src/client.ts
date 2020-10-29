import Discord from 'discord.js';

import { CommandHandler } from './command_handler';

import { config, constants } from './../config'

export class Client {
    bot: Discord.Client;
    private commandHandler: CommandHandler;
    readonly prefix: string

    constructor(prefix:string) {
        this.prefix = prefix;
        this.bot = new Discord.Client();
        this.commandHandler = new CommandHandler(this.prefix);
    }
    
    public async start() {
        this.bot.on('ready', () => {
            console.log("ready");
            this.bot.user.setActivity({name: "[ONLINE]Juge avec le Tribunal :eyes:", type: 'CUSTOM_STATUS'});

            for(const guild of this.bot.guilds.cache) {
                for(const member of guild[1].members.cache) {
                    console.log(member[1].user.username);
                }
            }
        });

        this.bot.on('message', (msg) => {
            if(msg.author.bot
                || msg.channel.type != 'text'
                || !msg.content.startsWith(this.commandHandler.prefix)
                || !(msg.channel.name === constants.default.channels.name.entry_cmd
                    || config.server.channels.entry_cmd.find((id) => config.server.channels.entry_cmd === id) != undefined)) return;
            this.commandHandler.handleMessage(this.bot, msg);
        });
    }

    public login(token: string): Promise<string> {
        return this.bot.login(token);
    }
}

export let bot: Client = new Client(constants.bot.prefix);