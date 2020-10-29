import { bot } from "./client"
import { config_private }  from '../config_private'

bot.start();

bot.login(config_private.bot.token);
