import { constants } from './../../config';
import Discord from 'discord.js'
import { config } from '../../config'

export enum Status {
    AdministratorDiscord = 'ADMINISTRATOR',
    Admin                = 'ADMIN',
    Member               = 'MEMBER',
    Other                = 'OTHER'
}

export class Checking {
    static async getStatus(guildMember: Discord.GuildMember): Promise<Status> {
        let found = false;
        if (guildMember.hasPermission('ADMINISTRATOR')) return Status.AdministratorDiscord; // If the user has the "Administrator" perm, return admin
    
        loopRoleOwned:
        for (const roleOwned of guildMember.roles.cache) {
            if(roleOwned[1].name === constants.default.roles.name.member) {
                found = true;
                break;
            }
            for (const memberRoleID of config.server.roles.member) {
                if (roleOwned[1].id === memberRoleID) {
                    found = true;
                    break loopRoleOwned;
                }
            }
        }
        
        if (found) {
            for (const roleOwnedID of guildMember.roles.cache) {
                for (const adminRolesID of config.server.roles.admin) {
                    if (roleOwnedID[0] === adminRolesID) return Status.Admin;
                }
            }
            
            return Status.Member; // If they don't match, it is a Tribunal Member
        }
        return Status.Other; // If nothing matches, the user is a random guys who wants to acces to something he will never have because he is nothing in this giant world ... RIP
    }
}
