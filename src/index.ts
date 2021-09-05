import { Telegraf } from 'telegraf';
import { I18n } from '@edjopato/telegraf-i18n';
import * as path from 'path';
import * as dotenv from 'dotenv';
import {initProtocolDetailsMenu, initProtocolProposalDetailsMenu} from './menus';
import * as LocalSession from 'telegraf-session-local';
import {MenuActions, CurrentCtx} from './common/interfaces';
import {initSession} from "./middlewares";
import {initStartMenu} from "./menus/init/start-menu";
import {initProtocolProposalsMenu} from "./menus/init/protocol-proposals";
import {initProtocolVotersMenu} from "./menus/init/protocol-voters";
import {GenericMenu} from "telegraf-menu";
import {initProtocolVoterDetailsMenu} from "./menus/init/protocol-voter-details";

dotenv.config();

//use later a process.env.BOT_TOKEN
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const session = new LocalSession({ database: 'local.db.json' });
const i18n = new I18n({
    defaultLanguage: 'en',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    sessionName: 'session',
});

bot.use(Telegraf.log((log) => console.log('>>> Telegraf "' + new Date().toString() + '" :' + log)));
bot.use(session.middleware());
bot.use(i18n.middleware());
bot.use(initSession);
bot.use((ctx: CurrentCtx, next) => {ctx.i18n.locale(ctx.from.language_code); return next();})

/**
 * Required callback parser
 * */
bot.use(GenericMenu.middleware());

bot.command(MenuActions.START, async (ctx: CurrentCtx) => {
    await ctx.reply(ctx.i18n.t('welcome'));
    initStartMenu(ctx);
});
bot.action(new RegExp(MenuActions.START), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initStartMenu,
));

bot.action(new RegExp(MenuActions.PROTOCOL_DETAILS), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initProtocolDetailsMenu,
));

bot.action(new RegExp(MenuActions.PROTOCOL_PROPOSALS), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initProtocolProposalsMenu,
));

bot.action(new RegExp(MenuActions.PROTOCOL_VOTERS), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initProtocolVotersMenu,
));

bot.action(new RegExp(MenuActions.PROPOSAL_DETAILS), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initProtocolProposalDetailsMenu,
));

bot.action(new RegExp(MenuActions.PROTOCOL_VOTERS), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initProtocolVotersMenu,
));

bot.action(new RegExp(MenuActions.PROTOCOL_VOTER_DETAILS), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initProtocolVoterDetailsMenu,
));

bot.launch();