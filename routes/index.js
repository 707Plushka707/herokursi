
var fs = require('fs');
var express = require('express');
var router = express.Router();
const path = require('path');
const delay = require('delay')
const Binance = require('node-binance-api');
var RSI = require('technicalindicators').RSI;
var BB = require('technicalindicators').BollingerBands;
var _ = require('lodash');

const binance = new Binance().options({
  APIKEY: 'sDZIAFhiLkf9k9ii4DHMVXIjtaqTE833Kp7Gjigg68KfvndwhfhlPkyz0Ofq3aRI',
  APISECRET: 'SHUuUgl7rzCtxV0n0liii09RCcj47OuDkdxDqNzb2gmHMYGOFwzbHes9hSeXbV1Z'
});

var indicator = {
  RSI_period: 6,
  BB_period: 20,
  DataFrame_period: ['5m', '15m']
}
var oldDataRSI = null;
var currentDataRSI = null;
var binanceListCopyTrade = []
var AccAnhKien = new Binance().options({
  APIKEY: 'JLSZyDGla1SUotF2Mjkgp9NeyjKX2Cv1J4ryWiTKJ7g70UaIK51U8OpX2KeuRbvc',
  APISECRET: 'yjLkRmxqo3PoBpy01sYrSvywvAkOoGDVTBOZT4U8r1TXQijgwETZwTE2Z9twqimM',
})
binanceListCopyTrade.push(
  {
    name: 'Kiên',
    APIKEY: 'JLSZyDGla1SUotF2Mjkgp9NeyjKX2Cv1J4ryWiTKJ7g70UaIK51U8OpX2KeuRbvc',
    APISECRET: 'yjLkRmxqo3PoBpy01sYrSvywvAkOoGDVTBOZT4U8r1TXQijgwETZwTE2Z9twqimM',
    historyFile: 'kien.json'
  }
)
/* Account Binance*/
router.get('/getAccount', async function (req, res, next) {
  //res.render('index', { title: 'RSI' });
  let balance = await AccAnhKien.futuresBalance()
  console.log(balance)
  let acc = await AccAnhKien.futuresAccount()
  console.log(acc)
  let account = await AccAnhKien.futuresPrices();
  console.log(account)
  res.send(acc)
});

/**/
/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'RSI' });
  res.send("hello")
});
router.get('/rsi', (req, res, next) => {
  res.header("Content-Type", 'application/json');
  fs.readFile('rsi.json', (error, data) => {

  })
  res.sendFile(path.resolve('rsi.json'));
})

//**** price notification */
router.post('/setPriceNoti', (req, res, next) => {
  res.header("Content-Type", 'application/json');
  res.sendFile(path.resolve('rsi.json'));
})
router.post('/getPriceNoti', (req, res, next) => {
  res.header("Content-Type", 'application/json');
  res.sendFile(path.resolve('rsi.json'));
})
//**** End Price Notification  */

//**** Price and Indicator Info  */
router.post('/setPairList', (req, res, next) => {
  res.header("Content-Type", 'application/json');
  res.sendFile(path.resolve('rsi.json'));
})
router.post('/getPairList', (req, res, next) => {
  res.header("Content-Type", 'application/json');
  res.sendFile(path.resolve('rsi.json'));
})

router.post('/setClient', (req, res, next) => {
  res.header("Content-Type", 'application/json');
  res.sendFile(path.resolve('rsi.json'));
})
router.post('/getClient', (req, res, next) => {
  res.header("Content-Type", 'application/json');
  res.sendFile(path.resolve('rsi.json'));
})




//**** End Indicator Option  */
//get RSI and write to file

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
      // console.log('**** fetch error - limit IP')
      console.log(err)
      reject(err)
    }

  }).catch((err) => {
    console.log(err)
  });
}

//format lại theo kiểu lấy data ra trước rồi tính chart sau
async function getData(symbol, time) {
  return new Promise((resolve, reject) => {
    try {
      binance.candlesticks(symbol, time, (error, ticks, symbol) => {
        if (error) {
          reject(error)
        } else {
          let lastClose = []
          ticks.forEach(i => {
            let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = i;
            lastClose.push(close)
          })

          let last_tick = ticks[ticks.length - 1]

          resolve({
            "name": symbol,
            "time": time,
            "last_tick": last_tick,

            "ticks": [...ticks]
          })
        }
      })
    }
    catch (err) {
      console.log('**** fetch error - limit IP')
      console.log(err)
      reject(err)
    }

  }).catch((err) => {
    // console.log(err)
  });
}
function getIndicator_RSI(tick, period) {
  let lastClose = []

  tick.map(i => {
    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = i;
    lastClose.push(close)
  })
  var inputRSI = {
    values: lastClose,
    period: period,

  };
  let result = RSI.calculate(inputRSI)
  return { result: result[result.length - 1], period };
}
function getIndicator_BB(tick, period) {
  let lastClose = []

  tick.map(i => {
    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = i;
    lastClose.push(parseFloat(close))
  })
  var inputBB = {
    period: period,
    values: lastClose,
    stdDev: 2
  };
  let result = BB.calculate(inputBB)
  return { result: result[result.length - 1], period };
}
async function DataProcess(data) {
  return new Promise((resolve, reject) => {
    let allData = []

    data.map(item => {
      if (item) {
        let RSI = getIndicator_RSI(item.ticks, indicator.RSI_period)
        let BB = getIndicator_BB(item.ticks, indicator.BB_period)
        allData.push({
          name: item.name,
          rsi: RSI.result,
          BB: BB.result,
          period: RSI.period,
          last_tick: item.last_tick,
          time: item.time
        })
      }

    })
    let list = allData.sort(compare);

    list = _.groupBy(list, "name");
    let newList = [];
    _.forOwn(list, (value, key) => {
      let rsi15;
      let rsi5;
      let BB5;
      let BB15;
      let d = value;

      for (let i = 0; i < 2; i++) {

        if (d[i]) {
          if (d[i].time === "5m") {
            rsi5 = d[i];
            BB5 = d[i].BB
          }
          if (d[i].time === "15m") {
            rsi15 = d[i];
            BB15 = d[i].BB
          }
        } else {
          if (rsi15) {
            rsi5 = null;

          }
          if (rsi5) {
            rsi15 = null;
          }
        }
      }

      let newObject = {
        name: key,
        rsi15m: rsi15,
        rsi5m: rsi5,
        BB5m: BB5 || null,
        BB15m: BB15 || null
      };
      if (rsi15) {
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = rsi15.last_tick;
        newObject.last_tick = {
          time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored
        }
        if (newObject.rsi5m) {
          newObject.rsi5m = newObject.rsi5m.rsi
        } else {
          newObject.rsi5m = 0
        }
        if (newObject.rsi15m) {
          newObject.rsi15m = newObject.rsi15m.rsi
        } else {
          newObject.rsi15m = 0;
        }

        //newObject.last_tick = last_tick
        newList.push(newObject);
      }
    });

    resolve(newList)
  })
}
function compare(a, b) {
  if (a.rsi && b.rsi) {
    if (a.rsi > b.rsi) {
      return -1;
    }
    if (a.rsi < b.rsi) {
      return 1;
    }
    return 0;
  } else {
    return 0;
  }
}
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
  let TokenList = []
  console.log('===========================')
  console.log('Start binance socket')
  pairList.forEach(i => {
    TokenList.push(getData(i, '5m'));
    TokenList.push(getData(i, '15m'));
  })
  Promise.all(TokenList).then(data => {
    if (data) {
      DataProcess(data).then(data => {

        //data là dữ liệu mới
        //neu oldDataRSI chưa có gì thì lưu old thành dữ liệu hiện tại
        let old, current;

        if (!oldDataRSI) {
          oldDataRSI = data;
          old = data;
          current = data;
        } else {
          old = JSON.parse(JSON.stringify(oldDataRSI))
          current = data
          //luu lai thanh du lieu hien tai
          oldDataRSI = data;
        }
        let result = []
        current.map(itemCurrent => {
          old.map(itemOld => {
            if (itemCurrent.name === itemOld.name) {
              result.push(
                {
                  name: itemCurrent.name,
                  currentValue: itemCurrent,
                  oldValue: itemOld
                }
              )
            }
          })
        })
        fs.writeFile('rsi.json', JSON.stringify(result), err => {
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
    } else {
      console.log('fetch error, reload after 30s')
      delay(30 * 1000).then(data => {
        main()
      });
    }


  });

}

main();

module.exports = router;
