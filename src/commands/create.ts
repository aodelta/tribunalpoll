import Discord from 'discord.js'

import { Command } from '../command'
import { CommandContext } from '../command_context'

import { Embed } from '../embed'
import { Poll, TypeOfPoll } from '../poll'

import { config, constants } from '../../config'

export class Create implements Command {
    readonly commandName: string = "create";

    async run(cmdCtx: CommandContext): Promise<void> {
        let channel: Discord.GuildChannel = undefined;

        if(config.server.channels.poll.length > 0) {
            loopDChannel:
            for(const dChannel of cmdCtx.msg.guild.channels.cache) {
                if(dChannel[1].type !== "text") continue
                for(const channelID of config.server.channels.poll) {
                    if(dChannel[1].id == channelID || dChannel[1].name == constants.default.channels.name.poll) {
                        console.log("checkpoint");
                        channel = dChannel[1];
                        break loopDChannel;
                    }
                }
            }
        }
        else {
            for(const dChannel of cmdCtx.msg.guild.channels.cache) {
                if(dChannel[1].type !== "text") continue
                if(dChannel[1].name == constants.default.channels.name.poll) {
                    console.log("checkpoint");
                    channel = dChannel[1];
                    break;
                }
            }
        }
        
        if(channel === undefined) {
            Embed.ResultChangement(cmdCtx.msg, "gray", "Création de Poll échoué", "Le channel TribunalPoll n'est pas renseigné dans les paramètres du bot et aucun channel"
            + " défaut n'a été trouvé");
            return;
        }
        
        let type: TypeOfPoll = TypeOfPoll.Undefined;
        let typeInput = cmdCtx.args[3].toLowerCase();
        let name = cmdCtx.args[1];

        if(cmdCtx.args.length === 4) {
            if(typeInput === "-ddd"
            || typeInput === "-ur") {
                type = TypeOfPoll.UnbanRequest;
            }
            else if (typeInput === "-sur"
            ||       typeInput === "-surv"
            ||       typeInput === "-surveillance") {
                type = TypeOfPoll.Surveillance;
            }
            else if (typeInput === "-ana"
            ||       typeInput === "-anal"
            ||       typeInput === "-analy"
            ||       typeInput === "-analyse") {
                type = TypeOfPoll.Analyse;
            }
            else if (typeInput === "-pl"
            ||       typeInput === "-complaint"
            ||       typeInput === "-plainte") {
                type = TypeOfPoll.Complaint;
            }
            else if (typeInput === "-autre"
            ||       typeInput === "-other") {
                type = TypeOfPoll.Other;
            }
        }

        cmdCtx.args.pop(); // Remove type
        cmdCtx.args.shift(); cmdCtx.args.shift(); // remove cmd + name
        
        let reason = cmdCtx.args.join(" ");

        if(name === "") {
            Embed.ResultChangement(cmdCtx.msg, "gray", "Création de Poll échoué", "Veuillez renseigner un nom valide");
            return;
        }
        if(reason === "") {
            Embed.ResultChangement(cmdCtx.msg, "gray", "Création de Poll échoué", "Veuillez renseigner une raison valide");
            return;
        }
        
        // Poll creation
        let poll = new Poll(name, reason, cmdCtx.msg.author, type);
        await poll.init(cmdCtx.msg.guild).then(() => {
            Embed.CreationPoll(cmdCtx.msg, channel, poll).then((msgback) => {
                poll.store(msgback);
                msgback.react("✅");
                msgback.react("❌");
            });
        });
    }
}
