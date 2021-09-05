import {MenuActions, CurrentCtx, Pagination} from "../../common/interfaces";
import {RegularMenu} from "telegraf-menu";
import {buildMenuKeyboard} from "../../common/helpers";
import {initProtocolDetailsMenu} from "./protocol-details";
import {initProtocolVoterDetailsMenu} from "./protocol-voter-details";

export const initProtocolVotersMenu = async (ctx: CurrentCtx) => {
    let protocolVotersIterator = await ctx.api.ProtocolVoters(ctx, ctx.session.startMenuState.cname);

    ctx.session.protocolVotersAddressMap = [];

    const PROTOCOL_VOTERS_FILTERS = await buildMenuKeyboard(
        ctx,
        protocolVotersIterator,
        (voter) => voter.address,
        (voter) => addressToShortId(ctx, voter.address),
        true
    )

    return new RegularMenu<CurrentCtx, string>({
        action: MenuActions.PROTOCOL_VOTERS,
        message:ctx.i18n.t('menu.protocol-voters.voters'),
        filters: PROTOCOL_VOTERS_FILTERS,
        replaceable: true,
        debug: false,
        menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
        menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
        async onChange(changeCtx, state) {
            if (state === Pagination.RIGHT){
                return await initProtocolVotersMenu(changeCtx);
            }

            if (state === Pagination.LEFT) {
                await protocolVotersIterator.resetToPrevious();
                return await initProtocolVotersMenu(changeCtx);
            }

            if (state === MenuActions.BACK) {
                return await initProtocolDetailsMenu(changeCtx);
            }

            console.log(state);
            changeCtx.session.protocolVotersMenuState = {'protocolVoterAddress': shortIdToAddress(changeCtx, state)}
            console.log(changeCtx.session);
            await initProtocolVoterDetailsMenu(changeCtx);
        },
    }).sendMenu(ctx);
}

function addressToShortId(ctx: CurrentCtx, refId: string): string {
    let shortId = ctx.session.protocolVotersAddressMap.length;
    ctx.session.protocolVotersAddressMap[shortId] = refId;

    return `${shortId}`;
}

function shortIdToAddress(ctx: CurrentCtx, shortId: string): string {
    return ctx.session.protocolVotersAddressMap[shortId];
}