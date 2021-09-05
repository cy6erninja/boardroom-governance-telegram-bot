"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
bot.command(interfaces_1.MenuActions.START, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.reply("Welcome to Boardroom API bot!")];
            case 1:
                _a.sent();
                start_menu_1.initStartMenu(ctx);
                return [2 /*return*/];
        }
    });
}); });
bot.action(new RegExp(interfaces_1.MenuActions.START), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, start_menu_1.initStartMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_DETAILS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, menus_1.initProtocolDetailsMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_PROPOSALS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, protocol_proposals_1.initProtocolProposalsMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_VOTERS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, protocol_voters_1.initProtocolVotersMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROPOSAL_DETAILS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, menus_1.initProtocolProposalDetailsMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_VOTERS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, protocol_voters_1.initProtocolVotersMenu));
bot.action(new RegExp(interfaces_1.MenuActions.PROTOCOL_VOTER_DETAILS), telegraf_menu_1.GenericMenu.onAction(function (ctx) { return ctx.session.keyboardMenu; }, protocol_voter_details_1.initProtocolVoterDetailsMenu));
bot.launch();
