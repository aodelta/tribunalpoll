import Discord from 'discord.js'

import { defineArrayWithQuotesLimiter } from './Utility/funcHelper'

export class CommandContext {
    readonly command: string;
    readonly args: string[];
    readonly qArgs:string[];
    readonly prefix: string;
    
    readonly msg: Discord.Message;
    readonly bot: Discord.Client;
    readonly botGM: Discord.GuildMember;

    constructor(bot: Discord.Client, msg: Discord.Message, prefix: string ) {
        this.bot = bot;
        this.botGM = msg.guild.members.cache.get(bot.user.id);

        this.msg = msg;
        this.prefix = prefix;
        this.args = defineArrayWithQuotesLimiter(msg.content);

        this.command = this.args[0].toLowerCase();
    }
}
