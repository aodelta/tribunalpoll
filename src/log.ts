import Discord from 'discord.js';
import { config, constants } from '../config';
import { Poll, TypeOfPoll } from './poll'
import { Status } from './Utility/checking'

export class Log {
    static async LogBase(msg: Discord.Message, embeded: Discord.MessageEmbed) {
        for(const channel of msg.guild.channels.cache) {
            if(channel[1].type !== "text") continue
            for(const channelID of config.server.channels.log_base) {
                if(channel[1].id === channelID || channel[1].name === constants.default.channels.name.log_base) {
                    (channel[1] as Discord.TextChannel).send({embed: embeded});
                }
            }
        }
    }

    static async LogAdvanced(msg: Discord.Message, embeded: Discord.MessageEmbed) {
        for(const channel of msg.guild.channels.cache) {
            if(channel[1].type !== "text") continue
            for(const channelID of config.server.channels.log_advanced) {
                if(channel[1].id === channelID || channel[1].name === constants.default.channels.name.log_advanced) {
                    (channel[1] as Discord.TextChannel).send({embed: embeded});
                }
            }
        }
    }

    static async LogWhenCreatingPoll(msg: Discord.Message, poll: Poll) {
        let embeded = new Discord.MessageEmbed();
    
        embeded.setTitle(`Creation du Poll Tribunal #${config.poll.latestID}`)
        embeded.setColor(constants.colors.purple);
        embeded.setAuthor(poll.author.tag, poll.author.avatarURL());
        embeded.addField("Auteur", poll.author.tag);
        embeded.addField("Cible", poll.name);
        embeded.addField("PollID", config.poll.latestID);
        embeded.addField("Raison", poll.reason);
        
        if(poll.type === TypeOfPoll.UnbanRequest)
            embeded.addField("Type", "Demande de deban");
        else if (poll.type === 'SURV') 
            embeded.addField("Type", "Surveillance/Analyse");
        
        embeded.addField("Date", new Date());
        embeded.setTimestamp();
        
        this.LogBase(msg, embeded);
    }

    static async LogWhenDeletingPoll(msg: Discord.Message, poll: Poll, user: Discord.User) {
        let embeded = new Discord.MessageEmbed();
    
        embeded.setTitle(`Suppression du Poll Tribunal ${poll.name} #${config.poll.latestID}`)
        embeded.setColor(constants.colors.purple);
        embeded.setAuthor(user.tag, user.avatarURL());
        embeded.addField("Auteur de la supppression", poll.author.tag);
        embeded.addField("Cible", poll.name);

        if(poll.type === TypeOfPoll.UnbanRequest)
            embeded.addField("Type", "Demande de deban");
        
        else if (poll.type === TypeOfPoll.Surveillance)
            embeded.addField("Type", "Surveillance");
        
        else if (poll.type === TypeOfPoll.Analyse)
            embeded.addField("Type", "Surveillance");

        else if (poll.type === TypeOfPoll.Complaint)
            embeded.addField("Type", "Plainte");
        
        let checkMembers = [], xMembers = [];
        for (let member of poll.responses.list) {
            member.decision === 1 ? checkMembers.push(member.author.tag) : xMembers.push(member.author.tag);
        }
        if(checkMembers.length === 0)
            embeded.addField(":white_check_mark:", "Aucun")
        else
            embeded.addField(":white_check_mark:", checkMembers.join(", "));
        if(xMembers.length === 0)
            embeded.addField(":x:", "Aucun")
        else
            embeded.addField(":x:", checkMembers.join(", "));
        
        embeded.addField("Date", new Date());
    
        embeded.setTimestamp();

        this.LogBase(poll.msg, embeded);
    }

    static async LogWhenReacted(msg: Discord.Message, user: Discord.User, poll: Poll, reaction: Discord.MessageReactionResolvable, status: Status) {
        let embeded = new Discord.MessageEmbed();
        
        if(reaction === '✅')
            embeded.setTitle(`${user.tag} a réagi avec :white_check_mark:`);
        else if(reaction === '❌')
            embeded.setTitle(`${user.tag} a réagi avec :x:`);
        embeded.setColor(constants.colors.purple);
        embeded.setAuthor(user.tag, user.avatarURL());
        embeded.addField("Poll", poll.name + " #" + config.poll.latestID);
        embeded.addField("Status", status);
        embeded.setTimestamp();
        
        this.LogBase(poll.msg, embeded);
    }

    static async LogWhenUnreacted(msg: Discord.Message, user: Discord.User, poll: Poll, reaction: Discord.MessageReactionResolvable, status: Status) {
        let embeded = new Discord.MessageEmbed();
    
        if(reaction === '✅')
            embeded.setTitle(`${user.tag} a supprimé sa réaction :white_check_mark:`);
        else if(reaction === '❌')
            embeded.setTitle(`${user.tag} a supprimé sa réaction :x:`);
        embeded.setColor(constants.colors.purple);
        embeded.setAuthor(user.tag, user.avatarURL());
        embeded.addField("Poll", poll.name + " #" + config.poll.latestID);
        embeded.addField("Status", status);
        embeded.setTimestamp();

        this.LogBase(poll.msg, embeded);
    }
}
