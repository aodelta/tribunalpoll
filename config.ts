export let config = {
    server: {
        channels: {
            entry_cmd: [],
            poll: "",
            decision: [],
            log: []
        },
        roles: {
            member: [],
            admin: []
        },
    },
    poll: {
        latestID : 1
    },
}

export const constants = {
    bot: {
        prefix: "trb|",
        ID : "694575909826592798"
    },
    colors: {
        black:  "#000000",
        gray:   "#c7c7c7",
        green:  "#00ff00",
        purple: "#9300fc",
        orange: "#ff9a00",
        red:    "#ff0000"
    },
    default: {
        channels: {
            name: {
                entry_cmd: "➖tribunal_chat",
                poll:      "➖tribunal_poll",
                decision:  "➖tribunal_decision",
                log:       "➖tribunal_log",
            }
        },
        roles: {
            name: {
                member: "Trb | Membre",
                admin:  "Trb | Admin"
            }
        }
    }
}
