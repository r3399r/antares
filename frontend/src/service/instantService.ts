import { instants } from 'src/constant/Instant';
import { InstantStat } from 'src/model/Instant';
import { bn } from 'src/util/bignumber';
import { compare } from 'src/util/compare';

export const getStats = (
  sort: keyof InstantStat = 'id',
  order: 'asc' | 'desc' = 'desc',
): InstantStat[] =>
  instants
    .map((data) => {
      let totalBingo = bn(0);
      let totalWin = bn(0);
      let totalNoLose = bn(0);
      let product = bn(0);
      let topPrize = 0;
      data.structure.forEach((v) => {
        totalBingo = totalBingo.plus(v.count);
        if (v.prize > data.cost) totalWin = totalWin.plus(v.count);
        if (v.prize >= data.cost) totalNoLose = totalNoLose.plus(v.count);
        if (v.prize > 5000) product = bn(v.prize).times(0.8).times(v.count).plus(product);
        else product = bn(v.prize).times(v.count).plus(product);
        if (v.prize > topPrize) topPrize = v.prize;
      });

      const bingoRate = totalBingo.div(data.total).times(100).toFixed(1);
      const winRate = totalWin.div(data.total).times(100).toFixed(1);
      const noLoseRate = totalNoLose.div(data.total).times(100).toFixed(1);
      const expect = product.div(data.total).div(data.cost).times(100).toFixed(1);

      return {
        id: data.id,
        topic: data.topic,
        cost: data.cost,
        totalW: Math.floor(data.total / 10000),
        totalR: data.total % 10000,
        bingoRate,
        winRate,
        noLoseRate,
        expect,
        topPrize: topPrize / 10000,
        topCount: data.structure.find((v) => v.prize === topPrize)?.count ?? 0,
        closeDate: data.closeDate,
      };
    })
    .sort(compare(sort, order));
