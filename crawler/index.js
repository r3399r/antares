const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

const extractGame = (content) => {
    const $ = cheerio.load(content)
    const games = [];

    // Find all game sections (table_area1, table_area2, etc.)
    $('div[class^="table_area"]').each((i, section) => {
        const $section = $(section);

        // 2. Extract Title and ID
        const gameTitle = $section.find('h2').first().text().replace('遊戲主題：', '').trim();
        const gameId = $section.find('h1').first().text().replace('遊戲期數：', '').trim();

        const prizes = [];

        // 3. Find all prize tables within THIS specific section
        // Using a filter to ensure we get the data tables, not the 'summy' (summary) tables
        $section.find('table').each((tIdx, table) => {
            const $table = $(table);

            // Skip summary tables (Total tickets / Probability)
            if ($table.hasClass('table1_summy') || $table.attr('class').includes('summy')) {
                return;
            }

            const $cols = $table.find('td');
            if ($cols.length >= 2) {
                const prizeItems = $cols.eq(0).find('li');
                const countItems = $cols.eq(1).find('li');

                prizeItems.each((index, li) => {
                    let rawPrize = $(li).text().trim();
                    let rawCount = $(countItems[index]).text().trim();

                    // Clean characters: strip NT$, commas, and common non-breaking space variants
                    const cleanPrize = rawPrize.replace(/[NT\$,\s\u00a0]/g, '');
                    const cleanCount = rawCount.replace(/[, \s\u00a0]/g, '');

                    // Only add if we have actual digits
                    if (cleanPrize && /^\d+$/.test(cleanPrize)) {
                        prizes.push({
                            prize: parseInt(cleanPrize, 10),
                            count: parseInt(cleanCount, 10) || 0
                        });
                    }
                });
            }
        });
        console.log(`Game Title: ${gameTitle}, Game ID: ${gameId}`);
        console.log('Prizes:', prizes);
        if (gameId) {
            games.push({
                gameId,
                gameTitle,
                prizes
            });
        }
    });
    return games;
}

const getAllScratches = async () => {
    const res = await axios.get('https://api.taiwanlottery.com/TLCAPIWeB/Instant/Result?ScratchName&Start_ListingDate&End_ListingDate&PageNum=1&PageSize=100&Type=1')
    return res.data.content.resultList.filter(v => new Date(v.downDate) > new Date())
}

const buildFbCaption = (info) => {
    const sortedStructure = [...info.structure].sort((a, b) => b.prize - a.prize)
    const totalPayout = sortedStructure.reduce((sum, s) => sum + s.prize * s.count, 0)
    const totalRevenue = info.price * info.total
    const returnRate = totalRevenue > 0 ? ((totalPayout / totalRevenue) * 100).toFixed(1) : '0.0'
    const topPrize = sortedStructure[0]
    const topPrizeOdds = topPrize && topPrize.count > 0 ? Math.round(info.total / topPrize.count) : null

    const medals = ['🥇', '🥈', '🥉']
    const structureLines = sortedStructure.map((s, i) => {
        const label = medals[i] || '🎁'
        const odds = s.count > 0 ? `（中獎機率 1/${Math.round(info.total / s.count).toLocaleString()}）` : ''
        return `${label} ${s.prize.toLocaleString()} 元 x ${s.count.toLocaleString()} 張 ${odds}`
    }).join('\n')

    return `🎰 新刮刮樂上市：${info.topic}\n`
        + `💰 售價：${info.price} 元\n`
        + `🎫 總張數：${info.total.toLocaleString()} 張\n`
        + `📅 上市日期：${new Date(info.releasedAt).toLocaleDateString()}\n`
        + `📈 中獎回饋率：約 ${returnRate}%\n`
        + (topPrizeOdds ? `✨ 頭獎中獎機率：1/${topPrizeOdds.toLocaleString()}\n` : '')
        + `\n🏆 獎金結構：\n${structureLines}`
}

const postFb = async (info) => {
    const res = await axios.post(`https://graph.facebook.com/${process.env.FB_PAGE_ID}/photos`, {
        url: info.picPath,
        access_token: process.env.FB_ACCESS_TOKEN,
        caption: buildFbCaption(info)
    })
    await axios.post(`https://graph.facebook.com/${res.data.post_id}/comments`, {
        message: "看更多刮刮樂機率分析\nhttps://lottery.celestialstudio.net",
        access_token: process.env.FB_ACCESS_TOKEN
    })
}

const main = async () => {
    let result = []
    let gameInfo = []

    let count = 0;
    const maxTries = 10;
    while (true) {
        try {
            const scratches = await getAllScratches()
            const newsIds = new Set(scratches.map(s => s.newsId))
            for (const newsId of newsIds) {
                const res = await axios.get(`https://api.taiwanlottery.com/TLCAPIWeB/News/Detail/${newsId}`)
                gameInfo = [...gameInfo, ...extractGame(res.data.content.content)]
            }

            for (const i of scratches) {
                const info = {
                    id: i.gameVol,
                    topic: i.scratchName,
                    price: i.money,
                    total: i.issuedCount,
                    releasedAt: i.listingDate,
                    closedAt: i.downDate,
                    picPath: i.picPath,
                    structure: gameInfo.find(g => g.gameId === i.gameVol)?.prizes || []
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