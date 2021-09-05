import {CurrentCtx, MenuActions} from "../../common/interfaces";
import {IProtocolVoter, IVoterProtocol} from "../../api/interfaces";
import {KeyboardButton, RegularMenu} from "telegraf-menu";
import {initProtocolVotersMenu} from "./protocol-voters";

export const initProtocolVoterDetailsMenu = async (ctx: CurrentCtx) => {
    let protocolVoter: IProtocolVoter = await ctx.api.ProtocolVoterDetails(
        ctx, ctx.session.protocolVotersMenuState.protocolVoterAddress
    );

    console.log(protocolVoter);

    return new RegularMenu<CurrentCtx, string>(
        {
            action: MenuActions.PROTOCOL_VOTER_DETAILS,
            message: getMessage(protocolVoter),
            filters: [
                [new KeyboardButton<string>(ctx.i18n.t('menu.back'), MenuActions.BACK)],
            ],
            replaceable: true,
            debug: false,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            async onChange(changeCtx, state) {
                switch (state) {
                    case MenuActions.BACK:
                        let protocolVotersIterator = await ctx.api.ProtocolVoters(ctx, ctx.session.startMenuState.cname);
                        await protocolVotersIterator.resetToCurrent();
                        return initProtocolVotersMenu(changeCtx);
                }
            },
        },
    ).sendMenu(ctx);
};

function getMessage(protocolVoter: IProtocolVoter): string {
    let result = '';

    result += `
Voter Address: ${protocolVoter.address}
First Vote Cast: ${new Date(protocolVoter.firstVoteCast * 1000).toString()}
Last Vote Cast: ${new Date(protocolVoter.lastVoteCast * 1000).toString()}
Total Votes Cast: ${protocolVoter.totalVotesCast}
----------------

Voted In:
    `;

    protocolVoter.protocols.forEach((protocol: IVoterProtocol) => {
        result += `
----------------
protocol Name: ${protocol.protocol}
Total Votes Cast: ${protocol.totalVotesCast}
Last Vote Cast: ${new Date(protocol.lastVoteCast * 1000).toString()}
First Vote Cast: ${new Date(protocol.firstVoteCast * 1000).toString()}
Total Power Cast: ${protocol.totalPowerCast}
Last Cast Power: ${protocol.lastCastPower}
        `;
    });


    return result.substring(0, 4000);
}