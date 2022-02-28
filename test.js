const Binance = require('node-binance-api');
var binanceListCopyTrade = []
binanceListCopyTrade.push(
    {
        name: 'Kiên_1',
        APIKEY: 'JLSZyDGla1SUotF2Mjkgp9NeyjKX2Cv1J4ryWiTKJ7g70UaIK51U8OpX2KeuRbvc',
        APISECRET: 'yjLkRmxqo3PoBpy01sYrSvywvAkOoGDVTBOZT4U8r1TXQijgwETZwTE2Z9twqimM',
        historyFile: 'kien.json'
    },
    {
        name: 'Kiên_2',
        APIKEY: 'HtDcglR83C76HYYeAiNQoBH1nQDzTjvApufMSerzZs9JEfEKd4wCkX9xsgQoPtzh',
        APISECRET: 'MUVMwbTC23Dskq9EaiTxV5Xo4ibIQb6497Pd75rmpUhoHvx3XthsbU6sBv2WX15p',
        historyFile: 'kien.json'
    },
)
const express = require('express')
const app = express()
const port = 3000
let binance = new Binance().options({
    APIKEY: `JLSZyDGla1SUotF2Mjkgp9NeyjKX2Cv1J4ryWiTKJ7g70UaIK51U8OpX2KeuRbvc`,
    APISECRET: `yjLkRmxqo3PoBpy01sYrSvywvAkOoGDVTBOZT4U8r1TXQijgwETZwTE2Z9twqimM`,
})
app.get('/', async (req, res) => {
    res.send(await binance.futuresAllOrders())

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
async function main() {

    // console.log('start')
    // let listAccount = []
    // binanceListCopyTrade.map((item => {
    //     let binanceAcc = new Binance().options({
    //         APIKEY: item.APIKEY,
    //         APISECRET: item.APISECRET,
    //     })
    //     listAccount.push(binanceAcc)
    // }))
    // let listTask = []
    // listAccount.map(item => {
    //     listTask.push(item.futuresAccount())
    // })
    // Promise.all(listTask).then(data => {
    //     let result = []
    //     data.map((item, index) => {
    //         result.push({ name: binanceListCopyTrade[index].name, data: item })
    //     })
    //     console.log(result)
    // })
}