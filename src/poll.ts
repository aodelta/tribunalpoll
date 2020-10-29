import Discord from 'discord.js';

import { Embed } from './embed';
import { TribunalMemberCount } from './Utility/tribunalData'
import { Log } from './log';
import { Status } from './Utility/checking';
import { PollInProgress } from './global'

import { config, constants } from '../config';

export enum TypeOfPoll {
    UnbanRequest = 'UR',
    Surveillance = 'SURV',
    Analyse      = 'ANALY',
    Complaint    = 'COMP',
    Other        = 'OTHER',
    Undefined    = 'UNDEFINED'
}

export enum TypeOfDecision {
    Unban = "Unban",
    Ban = "Ban",
    NoUnban = "NoUnban",
    NoBan = "NoBan",
    Accepted = "Accepté",
    Rejected = "Rejeté",
    Other = "Autre",
    Undefined = "[Non définit]"
}

export class Poll {
    msg: Discord.Message;
    readonly name: string;
    readonly reason: string;
    readonly author :Discord.User;
    readonly type: TypeOfPoll;
    readonly pollID: number;

    isOpen: boolean;

    decision: {
        decision: TypeOfDecision,
        check: Discord.MessageReactionResolvable,
        x: Discord.MessageReactionResolvable
    }
    responses: {
        list: {
            author: Discord.User,
            decision: number
        }[],
        has: number,
        on: number
    }

    constructor(name: string, reason: string, author: Discord.User, type: TypeOfPoll) {
        /** @type {Discord.Message} pollmsg */
        this.msg = undefined;
        this.name = name;
        this.reason = reason;
        this.author = author;
        this.type = type || TypeOfPoll.UnbanRequest; // UnbanRequest du default if nothing specified
        
        this.isOpen = true;
        this.decision = {
            decision: TypeOfDecision.Undefined,
            check: undefined,
            x: undefined
        };
        
        this.responses = {
            list: [],
            has: 0,
            on: 0
        };
        this.pollID = config.poll.latestID;
    }

    async init(guild: Discord.Guild) {
        let tribunalMembersLength: number;
        await TribunalMemberCount(guild).then((members: Discord.GuildMember[]) => {
            tribunalMembersLength = members.length;
        });
        
        this.responses.on = tribunalMembersLength;
    }

    async store(message: Discord.Message) {
        this.incrementLatestID();
        this.msg = message;
        PollInProgress.value().push(this);
    }

    static async removePoll(msg: Discord.Message, poll: Poll, user: Discord.User) {
        PollInProgress.assign(PollInProgress.value().filter((_poll: { msg: Discord.Message; }) => _poll.msg !== poll.msg))
        Log.LogWhenDeletingPoll(msg, poll, user);
    }

    static async addResponse(poll: Poll, msgReac: Discord.MessageReaction, user: Discord.User, status: Status): Promise<void> {
        if(msgReac.emoji.name === '✅')
            poll.responses.list.push({author:user, decision: 1});
        if(msgReac.emoji.name === '❌')
            poll.responses.list.push({author:user, decision: 2});
        
        poll.responses.has++;
        if(status === Status.Admin || status === Status.AdministratorDiscord) {
            poll.responses.on++;
        }
        
        Log.LogWhenReacted(msgReac.message, user, poll, msgReac.emoji.name, status);

        if(poll.responses.has === poll.responses.on) { // If the Poll has ended

            poll.isOpen = false;
            
            poll.decision.check = msgReac.message.reactions.cache.get('✅'); // Get the MessageReaction of ✅
            poll.decision.x = msgReac.message.reactions.cache.get('❌'); // Get the MessageReaction of ❌

            poll.decision.check.users.cache.delete(constants.bot.ID); // Remove the bot reaction
            poll.decision.x.users.cache.delete(constants.bot.ID); // Remove the bot reaction
            
            switch(poll.type) {
                case TypeOfPoll.UnbanRequest: {
                    if(poll.decision.check.count === poll.responses.on)
                        poll.decision.decision = TypeOfDecision.Unban;
                    else
                        poll.decision.decision = TypeOfDecision.Ban;
                    break;
                }
                case TypeOfPoll.Analyse:
                case TypeOfPoll.Surveillance: {
                    if(poll.decision.check.count === poll.responses.on)
                        poll.decision.decision = TypeOfDecision.Ban;
                    else
                        poll.decision.decision = TypeOfDecision.NoBan;
                    break;
                }
                case TypeOfPoll.Complaint:
                case TypeOfPoll.Other:
                    if(poll.decision.check.count === poll.responses.on)
                        poll.decision.decision = TypeOfDecision.Accepted;
                    else
                        poll.decision.decision = TypeOfDecision.Rejected;
                    break;
            }
            
            Embed.RefreshPollmsg(poll, msgReac.message);
            Embed.PrintDecision(poll);
        }
        else {
            Embed.RefreshPollmsg(poll, msgReac.message);
        }
    }

    static async removeResponseFrom(poll: Poll, msgReac: Discord.MessageReaction, user: Discord.User, status: Status): Promise<void> {
        poll.responses.list = poll.responses.list.filter((rep: { author: { id: string; }; }) => rep.author.id !== user.id);
        
        console.log(status)

        poll.responses.has--;
        if(status === Status.Admin || status === Status.AdministratorDiscord) {
            poll.responses.on--;
            console.log("OVER MEMBER DETECTED")
        }

        Log.LogWhenUnreacted(msgReac.message, user, poll, msgReac.emoji.name, status)

        Embed.RefreshPollmsg(poll, msgReac.message);
    }

    static async hasCheckedBoth(poll: Poll, member: Discord.User): Promise<boolean> {
        if(poll.msg.reactions.cache.get('✅').users.cache.has(member.id)
        && poll.msg.reactions.cache.get('❌').users.cache.has(member.id))
            return true;

        return false;
    }

    static async hasCheckedOne(poll: Poll, member: Discord.User): Promise<boolean> {
        if(poll.msg.reactions.cache.get('✅').users.cache.has(member.id)
        || poll.msg.reactions.cache.get('❌').users.cache.has(member.id))
            return true;

        return false;
    }

    async incrementLatestID(): Promise<void> {
        config.poll.latestID++;
    }
}
