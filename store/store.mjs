import Redis from "ioredis";
import {evalTTS, compareTTS} from "../common/common.mjs";

const cmcPrefix = 'cmc';
const cmcSet = 'cmczet';
const expired = 24 * 60 * 60


class RedisStore {

    constructor(redisConnection) {
        this.rds = redisConnection;
    }

    storeCmcObj(cmcObj) {

        const timestamp = evalTTS(cmcObj);
        const key = `${cmcPrefix}.${cmcObj.symbol.toLowerCase()}.${timestamp}`;

        this.rds.set(key, JSON.stringify(cmcObj), 'ex', expired);
        this.rds.zadd(cmcSet, cmcObj.cmc_rank, cmcObj.symbol);
    }

    async getCmcObj(symbol, callback) {

        const result = {
            "symbol": symbol,
            "ts": [],
        };

        const keyPattern = `${cmcPrefix}.${symbol.toLowerCase()}.*`;

        const keys = await this.rds.keys(keyPattern);
        if (keys.length === 0) {
            callback(result);
            return;
        }

        const values = await this.rds.mget(keys);
        for (let i = 0; i < values.length; i++) {
            result.ts.push(JSON.parse(values[i]));
        }
        result.ts.sort(compareTTS);

        callback(result);
    }

    async getCmcArray(callback) {
        const cmcArray = [];

        const keys = await this.rds.keys(`${cmcPrefix}.*`);
        if (keys.length === 0) {
            callback(cmcArray);
            return
        }

        const values = await this.rds.mget(keys);
        for (let i = 0; i < values.length; i++) {
            cmcArray.push(JSON.parse(values[i]));
        }

        callback(cmcArray);
    }

    async getSymbols(callback) {
        const result = await this.rds.zrange(cmcSet, 0, -1);
        callback(result);
    }
}

const rds = new Redis({
    port: 13582,
    host: 'redis-13582.c84.us-east-1-2.ec2.cloud.redislabs.com',
    password: 'vN2DJjBvLOAyVVgGb77OUqy6GDgwxW4Q'
});

rds.ping(function (err, result) {
    console.log(result);
});

const store = new RedisStore(rds);

export {RedisStore, store}


