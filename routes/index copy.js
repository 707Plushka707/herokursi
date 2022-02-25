
var fs = require('fs');
var express = require('express');
var fetch = require('cross-fetch');
var router = express.Router();
const path = require('path');
const delay = require('delay')
const Binance = require('node-binance-api');
const { toNamespacedPath } = require('path');
const binance = new Binance().options({
  APIKEY: 'sDZIAFhiLkf9k9ii4DHMVXIjtaqTE833Kp7Gjigg68KfvndwhfhlPkyz0Ofq3aRI',
  APISECRET: 'SHUuUgl7rzCtxV0n0liii09RCcj47OuDkdxDqNzb2gmHMYGOFwzbHes9hSeXbV1Z'
});
var binanceListCopyTrade = []
binanceListCopyTrade.push(
  {
    name: 'Kiên',
    APIKEY: 'JLSZyDGla1SUotF2Mjkgp9NeyjKX2Cv1J4ryWiTKJ7g70UaIK51U8OpX2KeuRbvc',
    APISECRET: 'yjLkRmxqo3PoBpy01sYrSvywvAkOoGDVTBOZT4U8r1TXQijgwETZwTE2Z9twqimM',
    historyFile: 'kien.json'
  }
)

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'RSI' });
  res.send("hello")
});
router.get('/rsi', (req, res, next) => {
  res.header("Content-Type", 'application/json');
  res.sendFile(path.resolve('rsi.json'));
})
//get RSI and write to file
var RSI = require('technicalindicators').RSI;

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
      console.log('**** fetch error - limit IP')
      reject(err)
    }

  }).catch((err) => {
    // console.log(err)
  });
}
//format lại theo kiểu lấy data ra trước rồi tính chart sau

const main = async () => {

  console.time("Running");
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
    "COMPUSDT",
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
  console.log('===========================')
  console.log('Start RSI on binance socket')
  pairList.forEach(i => {
    RSIlist.push(getRSI(i, '5m', 6))
    RSIlist.push(getRSI(i, '15m', 6))
  })
  Promise.all(RSIlist).then(data => {
    //  console.log(data)
    fs.writeFile('rsi.json', JSON.stringify(data), err => {
      const t = new Date();
      if (err) {
        console.log("DB Error :" + t)
        console.log('Start Again')
        return
      } else {
        console.log("DB Suscces at :" + t)
        console.timeEnd("Running");
        console.log('End')
        console.log('===========================')
      }
      delay(30 * 1000).then(data => {
        main()
      });

    })


  })

}

main();

module.exports = router;
