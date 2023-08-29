const axios = require("axios");
const cheerio = require("cheerio");

const getDetails = async (id, url) => {
    const pageHTML = await axios.get(url)
    const $ = cheerio.load(pageHTML.data)

    const structure = []
    let total

    const topic =$(`#${id}`).parent().next().text().split('\n')[0].split('：')[1]

    const table = $(`#${id}`).parent().siblings('.tableD').children().children()
    const length = $(table).length
    $(table).each((index, element) => {
        $('td', element).each((i, e) => {
            console.log(e.type,e.nextSibling.type)
        // if (e.type !== 'tag' || e.nextSibling.type !== 'tag') return;
            if (index !== 0 && index !== length - 1) {
                if (i % 2 === 0 && $(e).text().trim() !== '') {
                    const prize = Number($(e).text().split('NT$')[1].replace(/\,/g, ''))
                    const count = Number($(e.nextSibling.nextSibling).text().replace(/\,/g, ''))
                    structure.push({ prize, count })
                }
            }
            if(index===length-1){
                if(i===1){
                    total=Number($(e).text().replace(/\,/g,''))
                }
            }
        })
    })
    console.log(id,topic,total, structure)
    return structure
}

const main = async () => {
    const listPage = 'https://www.taiwanlottery.com.tw/info/instant/sale.aspx'
    const pageHTML = await axios.get(listPage)
    const $ = cheerio.load(pageHTML.data)

    const tempResult = []

    $('.tableFull tbody tr').each((index, element) => {
      if (element.type !== 'tag') return;

        let price
        let releaseDate
        let closeDate
        if ((index - 1) % 4 === 0) {
            $('td', element).each((i, e) => {
                if (i === 1) price = $(e).text()
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
            tempResult.push({
                id, price, releaseDate, closeDate, url
            })
        }
    })

    const result = []
    for (const i of tempResult) {
        const res = await getDetails(i.id, i.url)
        result.push({ ...i, structure: res })
    }

    console.log(result)
}

main()