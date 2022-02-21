const Binance = require('node-binance-api');
var RSI = require('technicalindicators').RSI;
const binance = new Binance().options({
    APIKEY: 'sDZIAFhiLkf9k9ii4DHMVXIjtaqTE833Kp7Gjigg68KfvndwhfhlPkyz0Ofq3aRI',
    APISECRET: 'SHUuUgl7rzCtxV0n0liii09RCcj47OuDkdxDqNzb2gmHMYGOFwzbHes9hSeXbV1Z'
});
const deplay = require('delay')
async function getRSI(symbol, timer, period) {
    return new Promise((resolve, reject) => {
        try {
            binance.candlesticks(symbol, timer, (error, ticks, symbol) => {
                if (error) {
                    reject(error)
                } else {
                    let lastClose = []
                    ticks.forEach(i => {
                        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = i;
                        lastClose.push(close)
                    })
                    // console.log(lastClose)
                    var inputRSI = {
                        values: lastClose,
                        period: period
                    };
                    let a = RSI.calculate(inputRSI)
                    let last_tick = ticks[ticks.length - 1]
                    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
                    resolve({
                        "name": symbol,
                        "time": timer,
                        "info": { time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored },
                        "RSI": a[a.length - 1]
                    })
                }
            })
        }
        catch (err) {
            reject(err)
        }

    }).catch((err) => {
        // console.log(err)
    });
}
const main = async () => {
    let pairList = [
        "RAYUSDT",
        "SUSHIUSDT",
        "CVCUSDT",
        "BTSUSDT",
        "HOTUSDT",
        "ZRXUSDT",
        "QTUMUSDT",
        "IOTAUSDT",
        "BTCBUSD",
        "WAVESUSDT",
        "ADAUSDT",
        "LITUSDT",
        "XTZUSDT",
        "BNBUSDT",
        "AKROUSDT",
        "HNTUSDT",
        "ETCUSDT",
        "XMRUSDT",
        "YFIUSDT",
        "FTTBUSD",
        "ETHUSDT",
        "ALICEUSDT",
        "ALPHAUSDT",
        "SFPUSDT",
        "REEFUSDT",
        "BATUSDT",
        "DOGEUSDT",
        "RLCUSDT",
        "TRXUSDT",
        "STORJUSDT",
        "SNXUSDT",
        "AUDIOUSDT",
        "XLMUSDT",
        "IOTXUSDT",
        "NEOUSDT",
        "UNIUSDT",
        "SANDUSDT",
        "DASHUSDT",
        "KAVAUSDT",
        "RUNEUSDT",
        "CTKUSDT",
        "LINKUSDT",
        "CELRUSDT",
        "RSRUSDT",
        "ADABUSD",
        "DGBUSDT",
        "SKLUSDT",
        "RENUSDT",
        "LPTUSDT",
        "TOMOUSDT",
        "MTLUSDT",
        "LTCUSDT",
        "DODOUSDT",
        "KSMUSDT",
        "EGLDUSDT",
        "BNBBUSD",
        "VETUSDT",
        "ONTUSDT",
        "IMXUSDT",
        "TRBUSDT",
        "MANAUSDT",
        "FLOWUSDT",
        "COTIUSDT",
        "CHRUSDT",
        "BAKEUSDT",
        "GRTUSDT",
        "FLMUSDT",
        "MASKUSDT",
        "EOSUSDT",
        "OGNUSDT",
        "SCUSDT",
        "BALUSDT",
        "STMXUSDT",
        "LUNAUSDT",
        "DENTUSDT",
        "1000BTTCUSDT",
        "KNCUSDT",
        "SRMUSDT",
        "ENJUSDT",
        "C98USDT",
        "ZENUSDT",
        "ATOMUSDT",
        "NEARUSDT",
        "SOLBUSD",
        "ENSUSDT",
        "BCHUSDT",
        "ATAUSDT",
        "IOSTUSDT",
        "HBARUSDT",
        "ZECUSDT",
        "1000SHIBUSDT",
        "TLMUSDT",
        "ANTUSDT",
        "ETHBUSD",
        "GALAUSDT",
        "AAVEUSDT",
        "GTCUSDT",
        "ALGOUSDT",
        "ICPUSDT",
        "LRCUSDT",
        "AVAXUSDT",
        "ARPAUSDT",
        "CELOUSDT",
        "ROSEUSDT",
        "MATICUSDT",
        "1INCHUSDT",
        "MKRUSDT",
        "PEOPLEUSDT",
        "THETAUSDT",
        "UNIUSDT",
        "LINAUSDT",
        "ARUSDT",
        "RVNUSDT",
        "FILUSDT",
        "NKNUSDT",
        "KLAYUSDT",
        "DEFIUSDT",
        "COMPUSDT",
        "BTCDOMUSDT",
        "SOLUSDT",
        "BTCUSDT",
        "OMGUSDT",
        "ICXUSDT",
        "BLZUSDT",
        "FTMUSDT",
        "YFIIUSDT",
        "BANDUSDT",
        "XRPBUSD",
        "DOGEBUSD",
        "XRPUSDT",
        "SXPUSDT",
        "CRVUSDT",
        "BELUSDT",
        "DOTUSDT",
        "XEMUSDT",
        "ONEUSDT",
        "ZILUSDT",
        "AXSUSDT",
        "DYDXUSDT",
        "OCEANUSDT",
        "CHZUSDT",
        "ANKRUSDT",
        "DUSKUSDT",
        "CTSIUSDT"
    ]
    let RSIlist = []
    pairList.forEach(i => {
        RSIlist.push(getRSI(i, '5m', 6))
        RSIlist.push(getRSI(i, '15m', 6))
    })
    Promise.all(RSIlist).then(data => {
        console.log(data)
        deplay(1000).then(data=>{
            console.log('start Main')
            main()
        })
    })

}

main();

