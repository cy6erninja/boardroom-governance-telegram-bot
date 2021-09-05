import {KeyboardButton} from "telegraf-menu";
import {CurrentCtx, MenuActions, Pagination} from "../interfaces";
import {Iterator} from "../../api/classes/Iterator";

export const buildMenuKeyboard = async function buildMenuKeyboard<T>(
    ctx: CurrentCtx,
    entitiesIterator: Iterator<T>,
    btnLabel: (entity: T) => string,
    btnValue: (entity: T) => string,
    addBackButton: Boolean = false
): Promise<Array<Array<KeyboardButton>>> {
    const MENU_FILTERS = [];
    let entities: Array<T> = await entitiesIterator.next();

    for (let i = 0; i < entities.length; i++) {
        MENU_FILTERS[MENU_FILTERS.length] = [];
        let entity: T = entities[i];
        MENU_FILTERS[MENU_FILTERS.length - 1][0] = new KeyboardButton(btnLabel(entity), btnValue(entity))
    }

    MENU_FILTERS[MENU_FILTERS.length] = [];
    if (!entitiesIterator.isStart()) {
        MENU_FILTERS[MENU_FILTERS.length - 1].push(
            new KeyboardButton(ctx.i18n.t('pagination.left'), Pagination.LEFT)
        );
    }

    if (!entitiesIterator.isDone()) {
        MENU_FILTERS[MENU_FILTERS.length - 1].push(
            new KeyboardButton(ctx.i18n.t('pagination.right'), Pagination.RIGHT)
        );
    }

    if (addBackButton) {
        MENU_FILTERS[MENU_FILTERS.length] = [
            new KeyboardButton(ctx.i18n.t('back'), MenuActions.BACK)
        ];
    }

    return new Promise((resolve) => {
        resolve(MENU_FILTERS)
    });
}