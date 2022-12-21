import express from "express";
import cron from "node-cron";

import {getCryptoLatest} from "./collector/cmc.mjs";
import {RedisStore, store} from "./store/store.mjs";

cron.schedule('1 */1 * * *', () => {
    getCryptoLatest((data) => {
        console.log(`cmc cache : ${data.length}`);
    });
});
getCryptoLatest((data) => {
    console.log(`cmc cache : ${data.length}`);
});

const app = express();
const port = 8080;

app.use((req, res, next) => {
    res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store"
    });
    next();
});

app.get('/symbols', (req, res) => {

    store.getSymbols((cmcSymbols) => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200);
        res.send(cmcSymbols);
    })
});


app.get('/cmc', (req, res) => {

    store.getCmcArray((cmcArray) => {
        res.setHeader('Content-Type', 'application/json')
        res.status(200);
        res.send(cmcArray);
    })
});

app.get('/cmc/:symbol', function (req, res) {

    store.getCmcObj(req.params.symbol, (cmcObj) => {

        res.setHeader('Content-Type', 'application/json')
        res.status(200);
        res.send(cmcObj);
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});