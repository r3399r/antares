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

const main = async () => {
    let result = []

    let count = 0;
    const maxTries = 10;
    while (true) {
        try {
            const scratches = await getAllScratches()

            for (const i of scratches) {
                const structure = await getStructure(i.gameVol, i.newsId)
                result.push({
                    id: i.gameVol,
                    topic: i.scratchName,
                    price: i.money,
                    total: i.issuedCount,
                    releasedAt: i.listingDate,
                    closedAt: i.downDate,
                    structure
                })
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