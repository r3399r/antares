const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

const PAGE_SIZE = 200;
const MAX_PAGES = 20;
const REQUEST_DELAY_MS = 150;
const MAX_RETRIES = 5;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry each request on its own instead of restarting the whole crawl, so one
// flaky response does not re-fetch (and re-post) everything.
const getWithRetry = async (url) => {
    for (let attempt = 1; ; attempt++) {
        try {
            return await axios.get(url);
        } catch (e) {
            if (attempt > MAX_RETRIES) throw e;
            console.log(`retry ${attempt}/${MAX_RETRIES}: ${url} (${e.message})`);
            await sleep(attempt * 1000);
        }
    }
}

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

            // Skip summary tables (Total tickets / Probability). A table without a
            // class attribute is kept, not a crash.
            const tableClass = $table.attr('class') || '';
            if ($table.hasClass('table1_summy') || tableClass.includes('summy')) {
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
                    const cleanPrize = rawPrize.replace(/[NT\$,\s ]/g, '');
                    const cleanCount = rawCount.replace(/[, \s ]/g, '');

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

// Every scratch card the lottery still publishes, on sale or not. Off-sale cards
// keep their own page so the pages (and their search rankings) survive.
const getAllScratches = async () => {
    const list = [];
    let totalSize = Infinity;

    for (let page = 1; page <= MAX_PAGES && list.length < totalSize; page++) {
        const res = await getWithRetry(`https://api.taiwanlottery.com/TLCAPIWeB/Instant/Result?ScratchName&Start_ListingDate&End_ListingDate&PageNum=${page}&PageSize=${PAGE_SIZE}&Type=1`)
        const content = res.data.content;
        totalSize = content.totalSize ?? list.length;
        const batch = content.resultList ?? [];
        if (batch.length === 0) break;
        list.push(...batch);
        await sleep(REQUEST_DELAY_MS);
    }

    console.log(`fetched ${list.length} scratch cards (totalSize ${totalSize})`);

    return list;
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
        message: `看「${info.topic}」完整獎金結構與中獎機率分析\nhttps://lottery.celestialstudio.net/instant/${info.id}/`,
        access_token: process.env.FB_ACCESS_TOKEN
    })
}

const main = async () => {
    const result = []
    let gameInfo = []

    const scratches = await getAllScratches()

    const newsIds = [...new Set(scratches.map(s => s.newsId).filter(Boolean))]
    for (const newsId of newsIds) {
        const res = await getWithRetry(`https://api.taiwanlottery.com/TLCAPIWeB/News/Detail/${newsId}`)
        gameInfo = [...gameInfo, ...extractGame(res.data.content.content)]
        await sleep(REQUEST_DELAY_MS)
    }
    console.log(`parsed prize structures for ${gameInfo.length} games from ${newsIds.length} news pages`)

    for (const i of scratches) {
        const info = {
            id: i.gameVol,
            topic: i.scratchName,
            price: i.money,
            total: i.issuedCount,
            releasedAt: i.listingDate,
            closedAt: i.downDate,
            exchangeLastDate: i.exchangeLastDate ?? null,
            picPath: i.picPath,
            structure: gameInfo.find(g => g.gameId === i.gameVol)?.prizes || []
        }
        if (info.structure.length === 0) {
            console.log(`WARN no prize structure: ${info.id} ${info.topic}`)
        }
        // Announce only cards that went on sale in the last week, and only where
        // Facebook credentials are configured, so local and dev runs stay silent.
        // A failed post must not abort the crawl, or the site would ship stale data.
        const isNew = new Date(i.listingDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        if (isNew && process.env.FB_PAGE_ID && process.env.FB_ACCESS_TOKEN) {
            try {
                await postFb(info)
            } catch (e) {
                console.log(`WARN facebook post failed for ${info.id} ${info.topic}: ${e.message}`)
            }
        }
        result.push(info)
    }

    const filename = '../frontend/src/constant/Instant.json'
    fs.writeFileSync(filename, JSON.stringify(result), { encoding: 'utf8', flag: 'w' })
    console.log(`wrote ${result.length} cards to ${filename}`)
}

main()
