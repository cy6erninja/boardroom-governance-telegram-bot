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
exports.Iterator = void 0;
var APISender_1 = require("./APISender");
var Iterator = /** @class */ (function () {
    function Iterator(ctx, apiPath) {
        this.NEXT_CURSOR = 'nextCursor';
        this.PREV_CURSORS = 'prevCursors';
        this.prevCursors = [];
        this.apiPath = apiPath;
        this.ctx = ctx;
        this.loadNextCursor();
        this.loadPrevCursors();
    }
    Iterator.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var responseJson, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, APISender_1.APISender.send(this.apiPath, this.nextCursor)];
                    case 1:
                        responseJson = _a.sent();
                        result = responseJson['data'];
                        if (this.nextCursor) {
                            this.prevCursors.push(this.nextCursor);
                        }
                        this.savePrevCursors();
                        this.saveNextCursor(responseJson);
                        return [2 /*return*/, new Promise(function (resolve) { return resolve(result); })];
                }
            });
        });
    };
    Iterator.prototype.resetToCurrent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prevCursor;
            return __generator(this, function (_a) {
                prevCursor = this.prevCursors.pop();
                this.saveNextCursor({ 'nextCursor': prevCursor });
                this.savePrevCursors();
                return [2 /*return*/];
            });
        });
    };
    Iterator.prototype.resetToPrevious = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prevCursor;
            return __generator(this, function (_a) {
                //The last item in prevCursors is always the current cursor, so we need to burn it to get to the actual previous.
                this.prevCursors.pop();
                prevCursor = this.prevCursors.pop();
                this.saveNextCursor({ 'nextCursor': prevCursor });
                this.savePrevCursors();
                return [2 /*return*/];
            });
        });
    };
    Iterator.prototype.isStart = function () {
        return !this.prevCursors.length;
    };
    Iterator.prototype.isDone = function () {
        return this.nextCursor == '';
    };
    Iterator.prototype.loadNextCursor = function () {
        var _a;
        //Load existing cursor if it is stored for requested api path.
        if (((_a = this.ctx.session.pagination) === null || _a === void 0 ? void 0 : _a[this.apiPath]) && this.NEXT_CURSOR in this.ctx.session.pagination[this.apiPath]) {
            this.nextCursor = this.ctx.session.pagination[this.apiPath][this.NEXT_CURSOR];
        }
    };
    Iterator.prototype.loadPrevCursors = function () {
        var _a, _b, _c;
        if ((_c = (_b = (_a = this.ctx.session) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b[this.apiPath]) === null || _c === void 0 ? void 0 : _c[this.PREV_CURSORS]) {
            this.prevCursors = this.ctx.session.pagination[this.apiPath][this.PREV_CURSORS];
        }
    };
    Iterator.prototype.saveNextCursor = function (apiResponseJson) {
        var _a, _b;
        if (!((_b = (_a = this.ctx.session) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b[this.apiPath])) {
            this.ctx.session.pagination[this.apiPath] = [];
        }
        if (this.NEXT_CURSOR in apiResponseJson) {
            this.ctx.session.pagination[this.apiPath][this.NEXT_CURSOR] = apiResponseJson[this.NEXT_CURSOR];
        }
        else {
            this.ctx.session.pagination[this.apiPath][this.NEXT_CURSOR] = '';
        }
        this.loadNextCursor();
    };
    Iterator.prototype.savePrevCursors = function () {
        var _a, _b;
        if (!((_b = (_a = this.ctx.session) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b[this.apiPath])) {
            this.ctx.session.pagination[this.apiPath] = [];
        }
        this.ctx.session.pagination[this.apiPath][this.PREV_CURSORS] = this.prevCursors;
        this.loadPrevCursors();
    };
    return Iterator;
}());
exports.Iterator = Iterator;
