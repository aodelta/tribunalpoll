import Discord from 'discord.js'

import { Poll } from './poll'
import { Embed } from './embed'
import { Checking, Status } from './Utility/checking';

import { PollInProgress } from './global'

export class Action {
    static async onMessageDeleted(msg: Discord.Message) {
        let logs = await msg.guild.fetchAuditLogs({type: 72});
        let entry = logs.entries.first();
        
        for(const poll of PollInProgress.value()) {
            if(poll.msg.id === msg.id) {
                Poll.removePoll(msg, poll, entry.executor);
                return;
            }
        }
    }

    static async onReactionAdded(msgReac: Discord.MessageReaction, user: Discord.User) {
        for(const poll of PollInProgress.value()) {
            if(poll.msg.id === msgReac.message.id) {
                if(!poll.isOpen)
                    return Embed.ResultChangement(msgReac.message, 'gray', "Reaction au Poll échoué", "Ce poll est fermé car tout les membres y ont répondu");
                
                let status: Status;
                /** user as a GuildMember */
                let guildMember = msgReac.message.guild.members.cache.get(user.id);
                if(guildMember !== undefined) {
                    await Checking.getStatus(guildMember).then((_status: any) => {
                        status = _status;
                    });
                }
                if(status === Status.Other)
                    return;
                
                await Poll.hasCheckedBoth(poll, user).then((promise_hasChecked) => {
                    if(!promise_hasChecked)
                        Poll.addResponse(poll, msgReac, user, status);
                });
                return;
            }
        }
    }

    static async onReactionRemoved(msgReac: Discord.MessageReaction, user: Discord.User) {
        for(const poll of PollInProgress.value()) {
            if(poll.msg.id === msgReac.message.id) {
                if(!poll.isOpen)
                    return Embed.ResultChangement(msgReac.message, 'gray', "Reaction au Poll échoué", "Ce poll est fermé car tout les membres y ont répondu");
    
                let status: Status;
                /** user as a GuildMember */
                let guildMember = msgReac.message.guild.members.cache.get(user.id);
                if(guildMember !== undefined) {
                    await Checking.getStatus(guildMember).then((_status) => {
                        status = _status;
                    });
                }
                
                if(status === Status.Other)
                    return;
    
                await Poll.hasCheckedOne(poll, user).then((promise_hasChecked) => {
                    if(!promise_hasChecked)
                        Poll.removeResponseFrom(poll, msgReac, user, status);
                });
                return;
            }
        }
    }
}
