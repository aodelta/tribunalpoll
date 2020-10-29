import Discord from 'discord.js'

import { Command } from './command'
import { CommandContext } from './command_context'

import { Create } from './commands/create'

export class CommandHandler {
    private commands: Command[];
    public readonly prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;

        const commandsClasses = [ Create ];
        this.commands = commandsClasses.map(commandClass => new commandClass());
    }

    public async handleMessage(bot: Discord.Client, msg: Discord.Message) {
        const commandContext = new CommandContext(bot, msg, this.prefix);

        const matchedCommand = this.commands.find(command => command.commandName == commandContext.command);

        if(!matchedCommand){
            // Do some stuff
            return;
        }

        else
            await matchedCommand.run(commandContext);
    }
}
