const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

const getStructure = async (id, newsId) => {
    const res = await axios.get(`https://api.taiwanlottery.com/TLCAPIWeB/News/Detail/${newsId}`)
    const $ = cheerio.load(res.data.content.content)

    const structure = []
    const table = $(`#${id}`).parent().siblings('table').children('tbody').children().children().children('ul')
    let n = 0
    let queue = []
    for (const ul of $(table)) {
        const li = $(ul).children('li')
        n = n + 1
        if (n % 2 === 1) {
            $(li).each((i, e) => {
                if ($(e).text() === '\u00a0') return
                queue.push(Number($(e).text().split('+')[0].match(/\d+/g).join('')))
            })
        }
        if (n % 2 === 0) {
            $(li).each((i, e) => {
                if ($(e).text() === '\u00a0') return
                const prize = queue.shift()
                if (prize === undefined) throw new Error('price is undefined')
                structure.push({ prize, count: Number($(e).text().match(/\d+/g).join('')) })
            })
        }
    }

    return structure
}

const getAllScratches = async () => {
    const res = await axios.get('https://api.taiwanlottery.com/TLCAPIWeB/Instant/Result?ScratchName&Start_ListingDate&End_ListingDate&PageNum=1&PageSize=100&Type=1')
    return res.data.content.resultList.filter(v => new Date(v.downDate) > new Date())
}

const postFb = async (info) => {
    const res = await axios.post(`https://graph.facebook.com/${process.env.FB_PAGE_ID}/photos`, {
        url: info.picPath,
        access_token: process.env.FB_ACCESS_TOKEN,
        caption: `主題: ${info.topic}\n售價: ${info.price}元\n總張數: ${info.total}張\n上市日期: ${new Date(info.releasedAt).toLocaleDateString()}\n\n獎金結構:\n${info.structure.sort((a, b) => b.prize - a.prize).map(s => `獎金${s.prize}元 ${s.count}張`).join('\n')}`
    })
    await axios.post(`https://graph.facebook.com/${res.data.post_id}/comments`, {
        message: "看更多刮刮樂機率分析\nhttps://lottery.celestialstudio.tw",
        access_token: process.env.FB_ACCESS_TOKEN
    })
}

const main = async () => {
    let result = []

    let count = 0;
    const maxTries = 10;
    while (true) {
        try {
            const scratches = await getAllScratches()

            for (const i of scratches) {
                const structure = await getStructure(i.gameVol, i.newsId)
                const info = {
                    id: i.gameVol,
                    topic: i.scratchName,
                    price: i.money,
                    total: i.issuedCount,
                    releasedAt: i.listingDate,
                    closedAt: i.downDate,
                    picPath: i.picPath,
                    structure
                }
                if (new Date(i.listingDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
                    await postFb(info)
                }
                result.push(info)
            }
            break;
        } catch (e) {
            console.log('tries:', count + 1)
            result = []
            if (count++ === maxTries) throw e;
        }
    }

    const filename = '../frontend/src/constant/Instant.json'
    fs.writeFileSync(filename, JSON.stringify(result), { encoding: 'utf8', flag: 'w' })
}

main()