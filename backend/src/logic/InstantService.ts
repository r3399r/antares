import axios from 'axios';
import cheerio from 'cheerio';
import { injectable } from 'inversify';
import { GetInstantResponse } from 'src/model/api';
import { Instant } from 'src/model/Instant';

/**
 * Service class for Instant
 */
@injectable()
export class InstantService {
  private async getInstantDetails(id: string, url: string) {
    console.log(id, 'start')
    const pageHTML = await axios.get(url);
    const $ = cheerio.load(pageHTML.data);

    const structure: Instant['structure'] = [];
    let total = 0;

    const topic = $(`#${id}`)
      .parent()
      .next()
      .text()
      .split('\n')[0]
      .split('：')[1];
    const table = $(`#${id}`)
      .parent()
      .siblings('.tableD')
      .children()
      .children();
    const length = $(table).length;
    $(table).each((index, element) => {
      $('td', element).each((i, e: any) => {
        if (index !== 0 && index !== length - 1) {
          if (i % 2 === 0 && $(e).text().trim() !== '') {
            const prize = Number(
              $(e).text().split('NT$')[1].replace(/\,/g, '')
            );
            const count = Number(
              $(e.nextSibling.nextSibling).text().replace(/\,/g, '')
            );
            structure.push({ prize, count });
          }
          if (index === length - 1)
            if (i === 1) total = Number($(e).text().replace(/\,/g, ''));
        }
      });
    });
    console.log(id, 'finish')
    return { topic, total, structure };
  }

  public async getInstants(): Promise<GetInstantResponse> {
    console.log('list start');
    const listPage = 'https://www.taiwanlottery.com.tw/info/instant/sale.aspx';
    const pageHTML = await axios.get(listPage);
    const $ = cheerio.load(pageHTML.data);
    const tempResult: Omit<Instant, 'topic' | 'total' | 'structure'>[] = [];

    $('.tableFull tbody tr').each((index, element) => {
      if (element.type !== 'tag') return;
      let price = 0;
      let releaseDate: Date = new Date();
      let closeDate: Date = new Date();
      if ((index - 1) % 4 === 0)
        $('td', element).each((i, e) => {
          if (i === 1) price = Number($(e).text().replace(/\,/g, ''));
          if (i === 3) {
            const tmpRelease = $(e).text();
            const [year, month, day] = tmpRelease.split('/');
            releaseDate = new Date(
              Number(year) + 1911,
              Number(month) - 1,
              Number(day)
            );
          }
          if (i === 4) {
            const tmpeClose = $(e).text();
            const [year, month, day] = tmpeClose.split('/');
            closeDate = new Date(
              Number(year) + 1911,
              Number(month) - 1,
              Number(day)
            );
          }
        });

      if (closeDate > new Date()) {
        const url = $('a', element.nextSibling).attr('href');
        if (!url) return;
        const id = url.split('#')[1];
        tempResult.push({
          id,
          price,
          releaseDate: releaseDate.toISOString(),
          closeDate: closeDate.toISOString(),
          url,
        });
      }
    });
    console.log('list finish');

    console.log(tempResult.length)
    return await Promise.all(tempResult.map(async v => {
      const res = await this.getInstantDetails(v.id, v.url);
      return { ...v, ...res }
    }))
  }
}
