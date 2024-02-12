import { Instant, InstantStat } from '@/model/Instant';
import { bn } from '@/util/bignumber';
import { compare } from '@/util/compare';
import { format } from 'date-fns';
import instants from '@/constant/Instant.json';

const calculateStats = (instants: Instant[]): InstantStat[] =>
  instants
    .map((data) => {
      let totalBingo = bn(0);
      let totalWin = bn(0);
      let totalNoLose = bn(0);
      let topPrize = bn(0);
      let productWithoutCost = bn(0);
      let productWinWithCost = bn(0);
      let productLoseWithCost = bn(0);

      for (const v of data.structure) {
        totalBingo = totalBingo.plus(v.count);
        if (bn(v.prize).gt(data.price)) totalWin = totalWin.plus(v.count);
        if (bn(v.prize).gte(data.price)) totalNoLose = totalNoLose.plus(v.count);
        if (topPrize.lt(v.prize)) topPrize = bn(v.prize);
        if (bn(v.prize).gt(5000))
          productWithoutCost = bn(v.prize).times(0.796).times(v.count).plus(productWithoutCost);
        else productWithoutCost = bn(v.prize).times(v.count).plus(productWithoutCost);
        if (bn(v.prize).gt(5000) && bn(v.prize).gt(data.price)) {
          productWinWithCost = bn(v.prize)
            .times(0.796)
            .minus(data.price)
            .times(v.count)
            .plus(productWinWithCost);
        } else if (bn(v.prize).gt(data.price)) {
          productWinWithCost = bn(v.prize)
            .minus(data.price)
            .times(v.count)
            .plus(productWinWithCost);
        }
        if (bn(v.prize).lt(data.price)) {
          productLoseWithCost = bn(data.price)
            .minus(v.prize)
            .times(v.count)
            .plus(productLoseWithCost);
        }
      }

      const bingoRate = totalBingo.div(data.total).times(100).toNumber();
      const winRate = totalWin.div(data.total).times(100).toNumber();
      const noLoseRate = totalNoLose.div(data.total).times(100).toNumber();
      const expect = productWithoutCost.div(data.total).div(data.price).times(100).toNumber();
      const totalLose = bn(data.total).minus(totalNoLose);
      const totalZero = bn(data.total).minus(totalBingo);
      productLoseWithCost = bn(data.price).times(totalZero).plus(productLoseWithCost);
      const expectWin = productWinWithCost.div(totalWin).toNumber();
      const expectLose = productLoseWithCost.div(totalLose).toNumber();
      const winLoseRatio = bn(expectWin).div(expectLose).toNumber();

      return {
        id: data.id,
        topic: data.topic,
        price: data.price,
        total: data.total,
        totalW: bn(data.total).div(10000).dp(0, 1).toNumber(),
        totalR: bn(data.total).mod(10000).dp(0).toNumber(),
        bingoRate,
        winRate,
        noLoseRate,
        expectWin,
        expectLose,
        winLoseRatio,
        expect,
        topPrize: topPrize.div(10000).toNumber(),
        topCount: data.structure.find((v) => topPrize.eq(v.prize))?.count ?? 0,
        closedAt: format(new Date(data.closedAt), 'yyyy/MM/dd'),
        releasedAt: format(new Date(data.releasedAt), 'yyyy/MM/dd'),
        structure: [...data.structure, { prize: 0, count: totalZero.toNumber() }],
      };
    })
    .sort(compare('id', 'desc'));

export const getInstants = () => calculateStats(instants as Instant[]);
