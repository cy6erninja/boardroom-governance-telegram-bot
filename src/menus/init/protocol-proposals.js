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
exports.initProtocolProposalsMenu = void 0;
var interfaces_1 = require("../../common/interfaces");
var telegraf_menu_1 = require("telegraf-menu");
var protocol_proposal_details_1 = require("./protocol-proposal-details");
var helpers_1 = require("../../common/helpers");
var protocol_details_1 = require("./protocol-details");
exports.initProtocolProposalsMenu = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var protocolProposalIterator, PROTOCOL_PROPOSAL_FILTERS;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.api.ProtocolProposals(ctx, ctx.session.startMenuState.cname)];
            case 1:
                protocolProposalIterator = _a.sent();
                ctx.session.protocolProposalRefIdMap = [];
                return [4 /*yield*/, helpers_1.buildMenuKeyboard(ctx, protocolProposalIterator, function (proposal) { return proposal.title; }, function (proposal) { return refIdToShortId(ctx, proposal.refId); })];
            case 2:
                PROTOCOL_PROPOSAL_FILTERS = _a.sent();
                return [2 /*return*/, new telegraf_menu_1.RegularMenu({
                        action: interfaces_1.MenuActions.PROTOCOL_PROPOSALS,
                        message: ctx.i18n.t("menu.protocol-proposal.proposals"),
                        filters: PROTOCOL_PROPOSAL_FILTERS.concat([
                            [new telegraf_menu_1.KeyboardButton(ctx.i18n.t('menu.back'), interfaces_1.MenuActions.BACK)]
                        ]),
                        replaceable: true,
                        debug: false,
                        menuGetter: function (menuCtx) { return menuCtx.session.keyboardMenu; },
                        menuSetter: function (menuCtx, menu) { return menuCtx.session.keyboardMenu = menu; },
                        onChange: function (changeCtx, state) {
                            switch (state) {
                                case interfaces_1.Pagination.RIGHT:
                                    return exports.initProtocolProposalsMenu(changeCtx);
                                case interfaces_1.Pagination.LEFT:
                                    protocolProposalIterator.resetToPrevious();
                                    return exports.initProtocolProposalsMenu(changeCtx);
                                case interfaces_1.MenuActions.BACK:
                                    return protocol_details_1.initProtocolDetailsMenu(changeCtx);
                                default:
                                    changeCtx.session.protocolProposalsMenuState = { 'protocolProposalRefId': shortIdToRefId(changeCtx, state) };
                                    return protocol_proposal_details_1.initProtocolProposalDetailsMenu(changeCtx);
                            }
                        }
                    }).sendMenu(ctx)];
        }
    });
}); };
function refIdToShortId(ctx, refId) {
    var shortId = ctx.session.protocolProposalRefIdMap.length;
    ctx.session.protocolProposalRefIdMap[shortId] = refId;
    return "" + shortId;
}
function shortIdToRefId(ctx, shortId) {
    return ctx.session.protocolProposalRefIdMap[shortId];
}
