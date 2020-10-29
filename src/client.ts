import Discord from 'discord.js';

import { CommandHandler } from './command_handler';
import * as Action from './action'

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
        });

        this.bot.on('message', (msg) => {
            if(msg.author.bot
                || msg.channel.type != 'text'
                || !msg.content.startsWith(this.commandHandler.prefix)
                || !(msg.channel.name === constants.default.channels.name.entry_cmd
                    || config.server.channels.entry_cmd.find((id) => config.server.channels.entry_cmd === id) != undefined)) return;
            this.commandHandler.handleMessage(this.bot, msg);
        });

        this.bot.on('messageReactionAdd', (reaction, user) => {
            Action.Action.onReactionAdded(reaction, (user as Discord.User));
        });
        this.bot.on('messageReactionRemove', (reaction, user) => {
            Action.Action.onReactionRemoved(reaction, (user as Discord.User));
        });
        this.bot.on('messageDelete', (msg) => {
            Action.Action.onMessageDeleted((msg as Discord.Message));
        });
        
    }

    public login(token: string): Promise<string> {
        return this.bot.login(token);
    }
}

export let bot: Client = new Client(constants.bot.prefix);