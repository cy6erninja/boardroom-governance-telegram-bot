import * as https from "https";

export class APISender {

    public static async send(path, cursor = '') {
        cursor = cursor !== '' && cursor != undefined ? `&cursor=${cursor}` : '';

        return new Promise((resolve, reject) => {
            let options = {
                hostname: process.env.BASE_URL,
                path: `${process.env.BASE_PATH}${path}?limit=${process.env.PAGINATION_LIMIT}${cursor}`,
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
}