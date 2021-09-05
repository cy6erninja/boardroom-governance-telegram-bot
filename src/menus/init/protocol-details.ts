import {KeyboardButton, RegularMenu} from 'telegraf-menu';
import {MenuActions, CurrentCtx} from '../../common/interfaces';
import {IProtocol} from "../../api/interfaces";
import {initStartMenu} from "./start-menu";
import {initProtocolProposalsMenu} from "./protocol-proposals";
import {initProtocolVotersMenu} from "./protocol-voters";
import {Iterator} from "../../api/classes/Iterator";

export const initProtocolDetailsMenu = async (ctx: CurrentCtx) => {
    let protocol: IProtocol = await ctx.api.ProtocolDetails(ctx.session.startMenuState.cname);

    return new RegularMenu<CurrentCtx, string>({
        action: MenuActions.PROTOCOL_DETAILS,
        message: getMessage(ctx, protocol),
        filters: [
            [new KeyboardButton(ctx.i18n.t('menu.protocol-details.protocol-proposals'), MenuActions.PROTOCOL_PROPOSALS)],
            [new KeyboardButton(ctx.i18n.t('menu.protocol-details.protocol-voters'), MenuActions.PROTOCOL_VOTERS)],
            [new KeyboardButton(ctx.i18n.t('menu.back'), MenuActions.BACK)]
        ],
        replaceable: true,
        debug: false,
        menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
        menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
        async onChange(changeCtx, state) {
            switch (state) {
                case MenuActions.PROTOCOL_PROPOSALS:
                    return initProtocolProposalsMenu(changeCtx);
                case MenuActions.PROTOCOL_VOTERS:
                    return initProtocolVotersMenu(changeCtx);
                case MenuActions.BACK:
                    let protocolIterator: Iterator<IProtocol> = await ctx.api.Protocols(ctx);
                    await protocolIterator.resetToCurrent();
                    return initStartMenu(changeCtx);
            }
        },
    }).sendMenu(ctx);
};

function getMessage(ctx: CurrentCtx, protocol: IProtocol): string {
    return `
${ctx.i18n.t('menu.protocol-details.protocol-details')}
----------------
${ctx.i18n.t('menu.protocol-details.name')}: ${protocol.name}
${ctx.i18n.t('menu.protocol-details.total-proposals')}: ${protocol.totalProposals}
${ctx.i18n.t('menu.protocol-details.total-voters')}: ${protocol.totalVotes}
${ctx.i18n.t('menu.protocol-details.unique-voters')}: ${protocol.uniqueVoters}
`;
}