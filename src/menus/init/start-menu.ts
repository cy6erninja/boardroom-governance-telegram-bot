import {MenuActions, CurrentCtx, Pagination} from "../../common/interfaces";
import {IProtocol} from "../../api/interfaces";
import {Iterator} from "../../api/classes/Iterator";
import {initProtocolDetailsMenu} from "./protocol-details";
import {buildMenuKeyboard} from "../../common/helpers";
import {RegularMenu} from "telegraf-menu";

export const initStartMenu = async (ctx: CurrentCtx) => {
    let protocolIterator: Iterator<IProtocol> = await ctx.api.Protocols(ctx);
    const START_MENU_KEYBOARD = await buildMenuKeyboard(
        ctx,
        protocolIterator,
        (protocol: IProtocol) => protocol.name,
        (protocol: IProtocol) => protocol.cname
    );

    return new RegularMenu<CurrentCtx, string>(
        {
            action: MenuActions.START,
            message: ctx.i18n.t('menu.start.start'),
            filters: START_MENU_KEYBOARD,
            replaceable: false,
            debug: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            async onChange(changeCtx, state) {
                if (state === Pagination.RIGHT) {
                    return initStartMenu(changeCtx);
                }
                if (state === Pagination.LEFT) {
                    await protocolIterator.resetToPrevious();
                    return initStartMenu(changeCtx);
                }

                changeCtx.session.startMenuState = {cname: state};
                return initProtocolDetailsMenu(changeCtx);
            },
        },
    ).sendMenu(ctx);
};