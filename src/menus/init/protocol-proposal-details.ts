import {MenuActions, CurrentCtx} from "../../common/interfaces";
import {IProposal} from "../../api/interfaces";
import {KeyboardButton, RegularMenu} from "telegraf-menu";
import {initProtocolProposalsMenu} from "./protocol-proposals";

export const initProtocolProposalDetailsMenu = async (ctx: CurrentCtx) => {
    let proposal: IProposal = await ctx.api.ProposalDetails(ctx, ctx.session.protocolProposalsMenuState.protocolProposalRefId);

    return new RegularMenu<CurrentCtx, string>(
        {
            action: MenuActions.PROPOSAL_DETAILS,
            message: getMessage(proposal),
            filters: [
                [new KeyboardButton<string>(ctx.i18n.t('menu.protocol-details.proposal-votes'), 'proposal-votes')],
                [new KeyboardButton<string>(ctx.i18n.t('menu.back'), MenuActions.BACK)],
            ],
            replaceable: true,
            debug: false,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            async onChange(changeCtx, state) {
                switch (state) {
                    case MenuActions.BACK:
                        let protocolProposalIterator = await ctx.api.ProtocolProposals(ctx, ctx.session.startMenuState.cname);
                        await protocolProposalIterator.resetToCurrent();
                        return initProtocolProposalsMenu(changeCtx);
                }
            },
        },
    ).sendMenu(ctx);
};

/**
 * NOTE:
 * Max. telegram message is 4096 byte, so the easiest way to display some content without error is to cut it.
 * May be improved later using different messages.
 */
function getMessage(proposal: IProposal): string {
    let results = '';

    proposal.results.map((item) => {
        results += `${proposal.choices[item['choice']]}: ${item['total']} Votes\n\r`
    });

    return `
Proposal Details
----------------
Protocol: ${proposal.protocol}
Proposer: ${proposal.proposer}
Total Votes: ${proposal.totalVotes}
State: ${proposal.currentState}

Results
----------------
${results}

${proposal.title.substring(200)}
----------------


${proposal.content.substring(3500)}
`;
}