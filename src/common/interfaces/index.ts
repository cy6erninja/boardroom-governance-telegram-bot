import { DefaultCtx, GenericMenu } from "telegraf-menu";
import {IAPI, ProtocolProposalsMenuState, ProtocolVoterMenuState, StartMenuState} from "../../api/interfaces";
import {I18nContext} from "@edjopato/telegraf-i18n";

export enum MenuActions {
    START = 'start',
    PROTOCOL_DETAILS = 'protocol-details',
    PROTOCOL_PROPOSALS = 'protocol-proposals',
    PROTOCOL_VOTERS = 'protocol-voters',
    PROPOSAL_DETAILS = 'proposal-details',
    PROTOCOL_VOTER_DETAILS = 'protocol-voter-details',
    BACK = 'back'
}

export enum Pagination {
    RIGHT = 'pagination.right',
    LEFT = 'pagination.left'
}

export type CurrentCtx = DefaultCtx & {
    readonly i18n: I18nContext,
    api: IAPI,
    session: {
        keyboardMenu: GenericMenu,
        startMenuState: StartMenuState,
        protocolProposalsMenuState: ProtocolProposalsMenuState,
        protocolVotersMenuState: ProtocolVoterMenuState,
        pagination: Array<Array<string>>,
        protocolProposalRefIdMap: Array<string>,
        protocolVotersAddressMap: Array<string>,
    },
};