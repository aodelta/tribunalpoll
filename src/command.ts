import { CommandContext } from './command_context'

export interface Command {
    readonly commandName: string;

    run(cmdCtx: CommandContext): void;
}
