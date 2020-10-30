import Discord from 'discord.js';

import { bot } from './client'
import { Poll, TypeOfDecision, TypeOfPoll } from './poll';
import { Log } from './log';

import { config, constants } from '../config';

export class Embed {
    static async ResultChangement(msg: Discord.Message, color: string, title: string, string: string, removeLatestMessage?: { bot: Discord.Client }, logAdvanced?: boolean ) {
        let embeded = new Discord.MessageEmbed();
        embeded.setAuthor(msg.author.tag, msg.author.avatarURL());
        embeded.setTitle(title);
        embeded.addField("Resultat", string);
        
        switch(color){
            case "gray":
                embeded.setColor(constants.colors.gray);
                break;
            case "purple":
                embeded.setColor(constants.colors.purple);
                break;
            case "orange":
                embeded.setColor(constants.colors.orange);
                break;
            case "red":
                embeded.setColor(constants.colors.red);
                break;
            default:
                msg.channel.send("Color not defined ( Error : Source )");
        }
        embeded.setTimestamp();

        let msgback: Discord.Message;

        msg.channel.send({embed:embeded}).then(async (promise_msgback) => {
            promise_msgback.delete({timeout:5000});
            msgback = promise_msgback;
            if(removeLatestMessage)
                if(msg.guild.members.cache.get(removeLatestMessage.bot.user.id).hasPermission('MANAGE_MESSAGES'))
                    msg.channel.messages.cache.get(msg.id).delete({timeout:5000});
            
        })
        return msgback;
    }
    
    static async CreationPoll(msg: Discord.Message, channel: Discord.GuildChannel, poll: Poll) : Promise<Discord.Message> {
        let embeded = new Discord.MessageEmbed();
        embeded.setColor(constants.colors.purple);
        embeded.setAuthor(poll.author.tag, poll.author.avatarURL());
        embeded.setTitle(poll.type + " | " + poll.name);
        embeded.addField("Raison", poll.reason);
        embeded.addField("Réponses", poll.responses.has + "/" + poll.responses.on);
        embeded.setFooter("Absynthium Tribunal Poll | request #" + poll.pollID);
        embeded.setTimestamp();
    
        let msgback: Discord.Message; // no return in then()
        // await to prevent then execute before main func (send() here)
        await (channel as Discord.TextChannel).send({embed:embeded}).then((promise_msgback_trb) => {
            Embed.ResultChangement(msg, "purple", "Poll Tribunal créé", "Le Poll Tribunal a bien été créé", {bot: bot.bot});
            Log.LogWhenCreatingPoll(msg, poll);
            msgback = promise_msgback_trb;
        });
        return msgback;
    }

    static async RefreshPollmsg(poll: Poll, msg: Discord.Message) {
        let embeded = new Discord.MessageEmbed();
        embeded.setColor(constants.colors.purple);
        embeded.setAuthor(poll.author.tag, poll.author.avatarURL());
        if(poll.isOpen)
            embeded.setTitle(`${poll.type}  |  ${poll.name}  |  EN COURS`);
        else
            embeded.setTitle(`${poll.type}  |  ${poll.name}  |  TERMINEE`);
        embeded.addField("Raison", poll.reason);
        embeded.addField("Réponses", poll.responses.has + "/" + poll.responses.on);
        embeded.setFooter("Absynthium Tribunal Poll | request #" + poll.pollID);
        embeded.setTimestamp();
    
        msg.edit(embeded);
    }

    static async PrintDecision(poll: Poll) {
        let embeded = new Discord.MessageEmbed();
        embeded.setColor(constants.colors.purple);
        embeded.setAuthor(poll.author.tag, poll.author.avatarURL());

        let decision: string = "";

        if(poll.type === TypeOfPoll.UnbanRequest) 
            poll.decision.decision === TypeOfDecision.Unban ? decision = 'UNBAN' : decision = 'NON UNBAN';
        else if (poll.type === TypeOfPoll.Surveillance || poll.type === TypeOfPoll.Analyse)
            poll.decision.decision === TypeOfDecision.Ban ? decision = 'BAN' : decision = 'NON BAN';
        
        embeded.setTitle(poll.name + " | " + decision);

        let checkMembers = [], xMembers = [];
        for(const member of (poll.decision.check as Discord.MessageReaction).users.cache) {
            checkMembers.push(member[1].tag);
        }
        for(const member of (poll.decision.x as Discord.MessageReaction).users.cache) {
            xMembers.push(member[1].tag);
        }
        if(checkMembers.length === 0)
            embeded.addField(":white_check_mark:", "Aucun")
        else
            embeded.addField(":white_check_mark:", checkMembers.join(", "));
        if(xMembers.length === 0)
            embeded.addField(":x:", "Aucun")
        else
            embeded.addField(":x:", xMembers.join(", "));
    
        embeded.setFooter("Absynthium Tribunal Poll | request #" + poll.pollID);
        embeded.setTimestamp();
        
        for(const channel of poll.msg.guild.channels.cache) {
            if(channel[1].type !== "text") continue
            if(channel[1].name === constants.default.channels.name.decision)
                (channel[1] as Discord.TextChannel).send({embed:embeded})
            for(const channelID of config.server.channels.decision) {
                if(channel[1].id === channelID) {
                    (channel[1] as Discord.TextChannel).send({embed:embeded})
                }
            }
        }
    }
}
