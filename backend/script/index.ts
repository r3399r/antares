import * as fs from 'fs'

const main = () => {
    const data = fs.readdirSync('./script/data')
    const filename = '../frontend/src/constant/Instant.json'

    const res = []
    for (const file of data) {
        const fileData = fs.readFileSync(`./script/data/${file}`, 'utf-8')
        res.push(JSON.parse(fileData))
    }
    fs.writeFileSync(filename, JSON.stringify(res), { encoding: 'utf8', flag: 'w' })
}

main()