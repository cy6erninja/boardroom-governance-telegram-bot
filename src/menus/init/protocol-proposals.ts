import {MenuActions, CurrentCtx, Pagination} from '../../common/interfaces';
import {KeyboardButton, RegularMenu} from "telegraf-menu";
import {Iterator} from "../../api/classes/Iterator";
import {IProposal} from "../../api/interfaces";
import {initProtocolProposalDetailsMenu} from "./protocol-proposal-details";
import {buildMenuKeyboard} from "../../common/helpers";
import {initProtocolDetailsMenu} from "./protocol-details";

export const initProtocolProposalsMenu = async(ctx: CurrentCtx) => {
    let protocolProposalIterator: Iterator<IProposal> = await ctx.api.ProtocolProposals(ctx, ctx.session.startMenuState.cname);

    ctx.session.protocolProposalRefIdMap = [];

    const PROTOCOL_PROPOSAL_FILTERS = await buildMenuKeyboard(
        ctx,
        protocolProposalIterator,
        (proposal) => proposal.title,
        (proposal) => refIdToShortId(ctx, proposal.refId)
    );

    return new RegularMenu<CurrentCtx, string>({
        action: MenuActions.PROTOCOL_PROPOSALS,
        message: ctx.i18n.t(`menu.protocol-proposal.proposals`),
        filters: PROTOCOL_PROPOSAL_FILTERS.concat([
            [new KeyboardButton(ctx.i18n.t('menu.back'), MenuActions.BACK)]
        ]),
        replaceable: true,
        debug: false,
        menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
        menuSetter: (menuCtx , menu) => menuCtx.session.keyboardMenu = menu,
        onChange(changeCtx, state) {
            switch (state) {
                case Pagination.RIGHT:
                    return initProtocolProposalsMenu(changeCtx);
                case Pagination.LEFT:
                    protocolProposalIterator.resetToPrevious();
                    return initProtocolProposalsMenu(changeCtx);
                case MenuActions.BACK:
                    return initProtocolDetailsMenu(changeCtx);
                default:
                    changeCtx.session.protocolProposalsMenuState = {'protocolProposalRefId': shortIdToRefId(changeCtx, state)};
                    return initProtocolProposalDetailsMenu(changeCtx);
            }
        },
    }).sendMenu(ctx);
}

function refIdToShortId(ctx: CurrentCtx, refId: string): string {
    let shortId = ctx.session.protocolProposalRefIdMap.length;
    ctx.session.protocolProposalRefIdMap[shortId] = refId;

    return `${shortId}`;
}

function shortIdToRefId(ctx: CurrentCtx, shortId: string): string {
    return ctx.session.protocolProposalRefIdMap[shortId];
}