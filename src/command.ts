import { CommandContext } from './command_context'

export interface Command<T = void> {
    readonly commandName: string;

    run(cmdCtx: CommandContext): Promise<void | T>;
}
