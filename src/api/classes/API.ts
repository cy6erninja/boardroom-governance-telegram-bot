import {IAPI, IProposal, IProtocol, IProtocolVoter} from "../interfaces";
import {Iterator} from "./Iterator";
import {CurrentCtx} from "../../common/interfaces";
import {APISender} from "./APISender";
const https = require('https');

export class API implements IAPI {
    public async Protocols(ctx: CurrentCtx): Promise<Iterator<IProtocol>> {
        let protocolIterator = new Iterator<IProtocol>(ctx, 'protocols');

        return new Promise((resolve) => {
            resolve(protocolIterator);
        });
    }

    public async ProtocolDetails(protocolCname: string): Promise<IProtocol> {
        let protocolDetailsJson = await APISender.send(`protocols/${protocolCname}`);

        return new Promise((resolve) => {
            resolve(protocolDetailsJson['data'] as IProtocol);
        });
    }

    public async ProtocolProposals(ctx: CurrentCtx, protocolCname: string): Promise<Iterator<IProposal>> {
        let protocolProposalsIterator = new Iterator<IProposal>(ctx, `protocols/${protocolCname}/proposals`);

        return new Promise((resolve) => {
            resolve(protocolProposalsIterator);
        });
    }

    public async ProposalDetails(ctx: CurrentCtx, refId: string): Promise<IProposal> {
        let protocolProposalDetails = await APISender.send(`proposals/${refId}`);

        return new Promise((resolve) => {
            resolve(protocolProposalDetails['data'] as IProposal);
        });
    }

    public async ProtocolVoters(ctx: CurrentCtx, cname: string): Promise<Iterator<IProtocolVoter>> {
        let protocolVotersIterator = new Iterator<IProtocolVoter>(ctx, `protocols/${cname}/voters`);

        return new Promise((resolve) => {
            resolve(protocolVotersIterator);
        });
    }

    public async ProtocolVoterDetails(ctx: CurrentCtx, voterAddress: string): Promise<IProtocolVoter> {
        let protocolVoterDetails = await APISender.send(`voters/${voterAddress}`);

        return new Promise((resolve) => {
            resolve(protocolVoterDetails['data'] as IProtocolVoter);
        });
    }




}