import { CurrentCtx } from '../common/interfaces';
import {API} from "../api/classes";

export const initSession = async <T extends CurrentCtx = CurrentCtx>(ctx: T, next: Function) => {
    if (!ctx.api) {
        ctx.api = new API();
    }

    if (!ctx.session?.pagination) {
        ctx.session.pagination = [];
    }

    return next();
};
