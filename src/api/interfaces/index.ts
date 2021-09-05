import {Iterator} from "../classes/Iterator";
import {CurrentCtx} from "../../common/interfaces";

export * from './states';

export interface IAPI {

    Protocols(ctx: CurrentCtx): Promise<Iterator<IProtocol>>;
    ProtocolDetails(protocolCname: string): Promise<IProtocol>;
    ProtocolProposals(ctx: CurrentCtx, protocolCname: string): Promise<Iterator<IProposal>>;
    ProposalDetails(ctx: CurrentCtx, refId: string): Promise<IProposal>;
    ProtocolVoters(ctx: CurrentCtx, cname: string): Promise<Iterator<IProtocolVoter>>;
    ProtocolVoterDetails(ctx: CurrentCtx, voterAddress: string): Promise<IProtocolVoter>;
    // get ProposalVotes(): Array<IProposalVote>;
    // get VoterVotes(): Array<IProposalVote>;
    // get AllVoters(): Array<IProtocolVoter>;
    // get GlobalStats(): IGlobaStats;
}

export interface IProtocol {
    name: string;
    cname: string;
    totalProposals: number;
    totalVotes: number;
    uniqueVoters: number;
    icons: Array<Object>;
    tokens: Array<IToken>;

    Proposals(): Promise<Array<IProposal>>
}

export interface IToken {
    adapter: string,
    symbol: string,
    network: string,
    contractAddress: string,
    marketPrices: Array<Object>
}

export interface IProposal {
    "refId": string,
    "id": string,
    "title": string,
    "content": string,
    "protocol": string,
    "adapter": string,
    "proposer": string,
    "totalVotes": number,
    "blockNumber": number,
    "startTime": Map<string, number>
    "endTime": Map<string, number>,
    "startTimestamp": number,
    "endTimestamp": number,
    "currentState": string,
    "choices": Array<string>,
    "results": Array<Map<string, number>>
}

export interface IProtocolVoter {
    "address": string,
    "firstVoteCast": number,
    "lastVoteCast": number,
    "totalVotesCast": number,
    "protocols": Array<IVoterProtocol>
}

export interface IVoterProtocol {
    "protocol": string,
    "totalVotesCast": number,
    "lastVoteCast": number,
    "firstVoteCast": number,
    "totalPowerCast": number,
    "lastCastPower": number
}



export interface IGlobaStats {

}
