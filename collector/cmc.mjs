import https from 'node:https';
import axios from 'axios';

import {RedisStore, store} from '../store/store.mjs';

const apiToken = 'bc30c178-03d5-4fc5-b17f-2a28fed40568';
const apiKey = 'X-CMC_PRO_API_KEY';
const apiURL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=100';

const getCryptoLatest = async (callback) => {

    const header = new Object();
    header[apiKey] = apiToken;
    header['Accept'] = 'application/json';

    const response = await axios({
        method: 'get',
        url: apiURL,
        responseType: 'json',
        headers: header
    })

    const tmpData = response.data;
    if (tmpData.status.error_code !== 0) {
        console.log('Error on CMC API');
        return
    }

    const resultArray = new Array();

    for (let i = 0; i < tmpData.data.length; i++) {

        const target = tmpData.data[i];
        const resultObj = new Object();

        resultObj['id'] = target.id;
        resultObj['name'] = target.name;
        resultObj['symbol'] = target.symbol;
        resultObj['max_supply'] = target.max_supply;
        resultObj['circulating_supply'] = target.circulating_supply;
        resultObj['total_supply'] = target.total_supply;
        resultObj['cmc_rank'] = target.cmc_rank;
        resultObj['price'] = target.quote['USD'].price;
        resultObj['volume_24h'] = target.quote['USD'].volume_24h;
        resultObj['volume_change_24h'] = target.quote['USD'].volume_change_24h;
        resultObj['percent_change_1h'] = target.quote['USD'].percent_change_1h;
        resultObj['percent_change_24h'] = target.quote['USD'].percent_change_24h;
        resultObj['market_cap'] = target.quote['USD'].market_cap;
        resultObj['last_updated'] = target.quote['USD'].last_updated;

        store.storeCmcObj(resultObj);

        resultArray.push(resultObj);
    }

    callback(resultArray);
};


export {getCryptoLatest}


