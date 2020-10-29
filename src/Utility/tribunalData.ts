import Discord from 'discord.js'

import { config, constants } from '../../config'

export async function TribunalMemberCount(guild: Discord.Guild) {
    let membersSet = new Set<Discord.GuildMember>();
    /*
    For each role 'dRole' in the server
        if (the name of the role 'dRole' is the default for the TribunalMember role defined in the config.ts file
        or it is one of the role defined by ID in the config.ts file)
            we add each members to the set
    */

    for(const dRole of guild.roles.cache) {
        if(dRole[1].name === constants.default.roles.name.member
            || config.server.roles.member.find((roleID) => roleID === dRole[1].id)) {
                for(const memberOfRole of dRole[1].members) {
                    membersSet.add(memberOfRole[1]);
                }
            }
    }

    for(const dRole of guild.roles.cache) {
        if(dRole[1].name === constants.default.roles.name.admin
            || config.server.roles.admin.find((roleID) => roleID === dRole[1].id)) {
                for(const memberOfRole of dRole[1].members) {
                    membersSet.delete(memberOfRole[1]);
                }
            }
        }
    return Array.from(membersSet);
}

export async function TribunalAdminCount(guild: Discord.Guild): Promise<Discord.GuildMember[]> {
    let adminsSet = new Set<Discord.GuildMember>();

    for(const dRole of guild.roles.cache) {
        if(dRole[1].name === constants.default.roles.name.admin
            || config.server.roles.admin.find((roleID) => roleID === dRole[1].id)) {
                for(const memberOfRole of dRole[1].members) {
                    adminsSet.add(memberOfRole[1]);
                }
        }
    }

    return Array.from(adminsSet);
}
