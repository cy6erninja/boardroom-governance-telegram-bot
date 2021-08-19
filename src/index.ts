import { Telegraf } from 'telegraf';
import * as LocalSession from 'telegraf-session-local';
import { DefaultCtx, GenericMenu, KeyboardButton, MenuFilters, RegularMenu} from 'telegraf-menu';
const https = require('https');

const CONFIG = {
    SECURE_TOKEN: "",
    BASE_URL: "api.boardroom.info",
}

//use later a process.env.BOT_TOKEN
const bot = new Telegraf(CONFIG.SECURE_TOKEN);
const session = new LocalSession({ database: 'local.db.json' });

bot.use(session.middleware());
bot.use(GenericMenu.middleware());

// const i18n = new I18n({
//     defaultLanguage: 'en',
//     directory: path.resolve(__dirname, 'locales'),
//     useSession: true,
//     sessionName: 'session',
// });

type CurrentCtx = DefaultCtx & {
    session: {
        videoFilters: {
            from: string;
            to: string;
        },
        keyboardMenu: GenericMenu,
    },
};

// enum MenuAction {
//     BASKET = 'basket',
//     VIDEO_FILTERS = 'video_filters',
//     LANGUAGE = 'language',
//     START = 'start',
// }

const initStartMenu = async (ctx: CurrentCtx) => {
    let protocols = await send('protocols?limit=10');
    const START_MENU_FILTERS = []; //define filters

    for (let i = 0; i < protocols['data'].length / 2; i++) {
        START_MENU_FILTERS[START_MENU_FILTERS.length] = [];
        let protocol = protocols['data'][i];
        START_MENU_FILTERS[START_MENU_FILTERS.length - 1][0] = new KeyboardButton(protocol.name, protocol.cname)

        if (i * 2 < protocols['data'].length) {
            let protocol2 = protocols['data'][i * 2];
            START_MENU_FILTERS[START_MENU_FILTERS.length - 1][1] = new KeyboardButton(protocol2.name, protocol2.cname);
        }
    }

    new RegularMenu<CurrentCtx, string>(
        {
            action: 'start',
            message: 'menu.start.start',
            filters: START_MENU_FILTERS,
            replaceable: true,
            debug: false,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            onChange(changeCtx, state) {
                // switch (state) {
                //     case MenuAction.BASKET:
                //         // return initBasketMenu(changeCtx);

                //     case MenuAction.LANGUAGE:
                //         // return initLanguageMenu(changeCtx);

                //     case MenuAction.VIDEO_FILTERS:
                //         // return initVideoFiltersMenu(changeCtx);
                // }
            },
        },
    ).sendMenu(ctx);
};

bot.command('start', initStartMenu);
bot.action(new RegExp('start'), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initStartMenu,
));

bot.launch();

// bot.start(async (ctx) => {
    
//     ctx.reply('What\'s up!');
    
// });

// bot.on('text', async (ctx) => {
//     let protocols = await send('protocols');
//     ctx.reply(protocols['data'].map((item) => item.name));
// });

// bot.launch()

async function send(path) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: CONFIG.BASE_URL,
            path: `/v1/${path}`,
            method: 'GET',
            port: 443
        };

        const req = https.request(options, (res) => {
            let fullResponse = "";
            res.on('data', (data) => {
                fullResponse += data;
            });

            res.on('close', () => {
                resolve(JSON.parse(fullResponse));
            });
        });

        req.on('error', (err) => {
            reject(err);
        })
    
        req.end();
    });
}