import { format } from 'date-fns';
import instantEndpoint from 'src/api/instantEndpoint';
import { Instant, InstantStat } from 'src/model/Instant';
import { bn } from 'src/util/bignumber';
import { compare } from 'src/util/compare';

const calculateStats = (instants: Instant[]): InstantStat[] =>
  instants
    .map((data) => {
      let totalBingo = bn(0);
      let totalWin = bn(0);
      let totalNoLose = bn(0);
      let product = bn(0);
      let topPrize = bn(0);

      for (const v of data.structure) {
        totalBingo = totalBingo.plus(v.count);
        if (v.prize > data.cost) totalWin = totalWin.plus(v.count);
        if (v.prize >= data.cost) totalNoLose = totalNoLose.plus(v.count);
        if (v.prize > 5000) product = bn(v.prize).times(0.796).times(v.count).plus(product);
        else product = bn(v.prize).times(v.count).plus(product);
        if (topPrize.lt(v.prize)) topPrize = bn(v.prize);
      }

      const bingoRate = totalBingo.div(data.total).times(100).toNumber();
      const winRate = totalWin.div(data.total).times(100).toNumber();
      const noLoseRate = totalNoLose.div(data.total).times(100).toNumber();
      const expect = product.div(data.total).div(data.cost).times(100).toNumber();

      return {
        id: data.id,
        serial: data.serial,
        topic: data.topic,
        cost: data.cost,
        totalW: Math.floor(data.total / 10000),
        totalR: data.total % 10000,
        bingoRate,
        winRate,
        noLoseRate,
        expect,
        topPrize: topPrize.div(10000).toNumber(),
        topCount: data.structure.find((v) => topPrize.eq(v.prize))?.count ?? 0,
        closedAt: format(new Date(data.closedAt), 'yyyy/MM/dd'),
      };
    })
    .sort(compare('serial', 'desc'));

export const getInstants = async () => {
  const res = await instantEndpoint.getInstant();

  return calculateStats(res.data);
};
