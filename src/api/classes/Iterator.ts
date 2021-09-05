import {CurrentCtx} from "../../common/interfaces";
import {APISender} from "./APISender";

export class Iterator<T> {
    private readonly NEXT_CURSOR = 'nextCursor';
    private readonly PREV_CURSORS = 'prevCursors';

    protected ctx: CurrentCtx;
    protected nextCursor: string;
    protected prevCursors: Array<string> = [];
    protected apiPath: string;

    public constructor(ctx: CurrentCtx, apiPath: string) {
        this.apiPath = apiPath;
        this.ctx = ctx;
        this.loadNextCursor();
        this.loadPrevCursors();
    }

    public async next(): Promise<Array<T>> {
        let responseJson = await APISender.send(this.apiPath, this.nextCursor);
        let result = responseJson['data'] as Array<T>;

        if (this.nextCursor) {
            this.prevCursors.push(this.nextCursor);
        }

        this.savePrevCursors();
        this.saveNextCursor(responseJson);

        return new Promise((resolve) => resolve(result));
    }

    public async resetToCurrent(): Promise<void> {
        let prevCursor = this.prevCursors.pop();

        this.saveNextCursor({'nextCursor': prevCursor})
        this.savePrevCursors();
    }

    public async resetToPrevious(): Promise<void> {
        //The last item in prevCursors is always the current cursor, so we need to burn it to get to the actual previous.
        this.prevCursors.pop();
        let prevCursor = this.prevCursors.pop();

        this.saveNextCursor({'nextCursor': prevCursor})
        this.savePrevCursors();
    }

    public isStart(): Boolean {
        return !this.prevCursors.length;
    }

    public isDone(): Boolean {
        return this.nextCursor == '';
    }

    protected loadNextCursor(): void {
        //Load existing cursor if it is stored for requested api path.
        if (this.ctx.session.pagination?.[this.apiPath] && this.NEXT_CURSOR in this.ctx.session.pagination[this.apiPath]) {
            this.nextCursor = this.ctx.session.pagination[this.apiPath][this.NEXT_CURSOR];
        }
    }

    protected loadPrevCursors(): void {
        if (this.ctx.session?.pagination?.[this.apiPath]?.[this.PREV_CURSORS]) {
            this.prevCursors = this.ctx.session.pagination[this.apiPath][this.PREV_CURSORS];
        }
    }

    protected saveNextCursor(apiResponseJson: Object): void {
        if (!this.ctx.session?.pagination?.[this.apiPath]) {
            this.ctx.session.pagination[this.apiPath] = [];
        }

        if (this.NEXT_CURSOR in apiResponseJson) {
            this.ctx.session.pagination[this.apiPath][this.NEXT_CURSOR] = apiResponseJson[this.NEXT_CURSOR]
        } else {
            this.ctx.session.pagination[this.apiPath][this.NEXT_CURSOR] = '';
        }

        this.loadNextCursor();
    }

    protected savePrevCursors(): void {
        if (!this.ctx.session?.pagination?.[this.apiPath]) {
            this.ctx.session.pagination[this.apiPath] = [];
        }

        this.ctx.session.pagination[this.apiPath][this.PREV_CURSORS] = this.prevCursors;

        this.loadPrevCursors();
    }
}