"use strict";
exports.__esModule = true;
var telegraf_1 = require("telegraf");
var telegraf_i18n_1 = require("@edjopato/telegraf-i18n");
var path = require("path");
var dotenv = require("dotenv");
var menus_1 = require("./menus");
var LocalSession = require("telegraf-session-local");
var interfaces_1 = require("./common/interfaces");
var middlewares_1 = require("./middlewares");
var start_menu_1 = require("./menus/init/start-menu");
var protocol_proposals_1 = require("./menus/init/protocol-proposals");
var protocol_voters_1 = require("./menus/init/protocol-voters");
var telegraf_menu_1 = require("telegraf-menu");
var protocol_voter_details_1 = require("./menus/init/protocol-voter-details");
dotenv.config();
//use later a process.env.BOT_TOKEN
var bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
var session = new LocalSession({ database: 'local.db.json' });
var i18n = new telegraf_i18n_1.I18n({
    defaultLanguage: 'en',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    sessionName: 'session'
});
bot.use(telegraf_1.Telegraf.log(function (log) { return console.log('>>> Telegraf "' + new Date().toString() + '" :' + log); }));
bot.use(session.middleware());
bot.use(i18n.middleware());
bot.use(middlewares_1.initSession);
bot.use(function (ctx, next) { ctx.i18n.locale(ctx.from.language_code); return next(); });
/**
 * Required callback parser
 * */
bot.use(telegraf_menu_1.GenericMenu.middleware());
bot.command(interfaces_1.MenuActions.START, function (ctx) { ctx.reply("Welcome to Boardroom API bot!"); start_menu_1.initStartMenu(ctx); });
bot.action(new RegExp(interfaces_1.MenuActions.START), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, start_menu_1.initStartMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_DETAILS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, menus_1.initProtocolDetailsMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_PROPOSALS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, protocol_proposals_1.initProtocolProposalsMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_VOTERS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, protocol_voters_1.initProtocolVotersMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROPOSAL_DETAILS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, menus_1.initProtocolProposalDetailsMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_VOTERS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, protocol_voters_1.initProtocolVotersMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_VOTER_DETAILS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, protocol_voter_details_1.initProtocolVoterDetailsMenu));
bot.launch();
