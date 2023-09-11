const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

const getDetails = async (id, url) => {
    const pageHTML = await axios.get(url)
    const $ = cheerio.load(pageHTML.data)

    const structure = []
    let total

    const topic = $(`#${id}`).parent().next().text().split('\n')[0].split('：')[1]

    const table = $(`#${id}`).parent().siblings('.tableD').children().children()
    const length = $(table).length
    $(table).each((index, element) => {
        $('td', element).each((i, e) => {
            if (index !== 0 && index !== length - 1) {
                if (i % 2 === 0 && $(e).text().trim() !== '') {
                    const prize = Number($(e).text().split('NT$')[1].replace(/\,/g, ''))
                    const count = Number($(e.nextSibling.nextSibling).text().replace(/\,/g, ''))
                    structure.push({ prize, count })
                }
            }
            if (index === length - 1) {
                if (i === 1) {
                    total = Number($(e).text().replace(/\,/g, ''))
                }
            }
        })
    })
    return { topic, total, structure }
}

const getOverall = async () => {
    const listPage = 'https://www.taiwanlottery.com.tw/info/instant/sale.aspx'
    const pageHTML = await axios.get(listPage)
    const $ = cheerio.load(pageHTML.data)

    const result = []

    $('.tableFull tbody tr').each((index, element) => {
        if (element.type !== 'tag') return;

        let price
        let releaseDate
        let closeDate
        if ((index - 1) % 4 === 0) {
            $('td', element).each((i, e) => {
                if (i === 1) price = Number($(e).text().replace(/\,/g, ''))
                if (i === 3) {
                    const tmpRelease = $(e).text()
                    const [year, month, day] = tmpRelease.split('/')
                    releaseDate = new Date(Number(year) + 1911, Number(month - 1), day)
                }
                if (i === 4) {
                    const tmpeClose = $(e).text()
                    const [year, month, day] = tmpeClose.split('/')
                    closeDate = new Date(Number(year) + 1911, Number(month - 1), day)
                }
            })
        }
        if (closeDate > Date.now()) {
            const url = $('a', element.nextSibling).attr('href')
            const id = url.split('#')[1]
            result.push({
                id, price, releasedAt: releaseDate.toISOString(), closedAt: closeDate.toISOString(), url
            })
        }
    })

    return result
}

const main = async () => {
    const result = []

    let count = 0;
    const maxTries = 3;
    while (true) {
        try {
            const tempResult = await getOverall()

            for (const i of tempResult) {
                const res = await getDetails(i.id, i.url)
                const { url, ...rest } = i
                result.push({ ...rest, ...res })
            }
            break;
        } catch (e) {
            console.log('tries:', count)
            if (count++ === maxTries) throw e;
        }
    }

    const filename = '../frontend/src/constant/Instant.json'
    fs.writeFileSync(filename, JSON.stringify(result), { encoding: 'utf8', flag: 'w' })
}

main()