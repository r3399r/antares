import { useCallback, useEffect, useState } from 'react';
import { InstantStat } from 'src/model/Instant';
import { getStats } from 'src/service/instantService';

const Instant = () => {
  const [stats, setStats] = useState<InstantStat[]>();
  const [sort, setSort] = useState<keyof InstantStat>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setStats(getStats(sort, order));
  }, [sort, order]);

  const click = useCallback(
    (key: keyof InstantStat) => {
      if (sort === key && order === 'desc') setOrder('asc');
      else if (sort === key && order === 'asc') setOrder('desc');
      else {
        setSort(key);
        setOrder('desc');
      }
    },
    [sort, order],
  );

  return (
    <div className="overflow-x-auto h-screen py-5">
      <div className="flex items-center text-center min-w-[840px] max-w-[1440px] mx-auto">
        <div className="w-1/6 min-w-[140px] p-1 cursor-pointer" onClick={() => click('id')}>
          刮刮樂主題
        </div>
        <div className="w-1/12 min-w-[70px] p-1 cursor-pointer" onClick={() => click('cost')}>
          售價
        </div>
        <div className="w-1/12 min-w-[70px] p-1 cursor-pointer" onClick={() => click('totalW')}>
          發行數量
        </div>
        <div className="w-1/12 min-w-[70px] p-1 cursor-pointer" onClick={() => click('bingoRate')}>
          中獎率
        </div>
        <div className="w-1/12 min-w-[70px] p-1 cursor-pointer" onClick={() => click('winRate')}>
          勝率
        </div>
        <div className="w-1/12 min-w-[70px] p-1 cursor-pointer" onClick={() => click('noLoseRate')}>
          回本率
        </div>
        <div className="w-1/12 min-w-[70px] p-1 cursor-pointer" onClick={() => click('expect')}>
          每百元期望值
        </div>
        <div className="w-1/12 min-w-[70px] p-1 cursor-pointer" onClick={() => click('topPrize')}>
          頭獎獎金
        </div>
        <div className="w-1/12 min-w-[70px] p-1 cursor-pointer" onClick={() => click('topCount')}>
          頭獎數量
        </div>
        <div className="w-1/12 min-w-[70px] p-1 cursor-pointer" onClick={() => click('closeDate')}>
          下市日
        </div>
        <div className="w-1/12 min-w-[70px] p-1" />
      </div>
      {stats?.map((v) => (
        <div
          key={v.id}
          className="flex items-center text-center min-w-[840px] max-w-[1440px] mx-auto"
        >
          <div className="w-1/6 min-w-[140px] p-1">{v.topic}</div>
          <div className="w-1/12 min-w-[70px] p-1">{v.cost}元</div>
          <div className="w-1/12 min-w-[70px] p-1">
            {v.totalW}萬{v.totalR === 0 ? '' : v.totalR}張
          </div>
          <div className="w-1/12 min-w-[70px] p-1">{v.bingoRate}%</div>
          <div className="w-1/12 min-w-[70px] p-1">{v.winRate}%</div>
          <div className="w-1/12 min-w-[70px] p-1">{v.noLoseRate}%</div>
          <div className="w-1/12 min-w-[70px] p-1">{v.expect}元</div>
          <div className="w-1/12 min-w-[70px] p-1">{v.topPrize}萬元</div>
          <div className="w-1/12 min-w-[70px] p-1">{v.topCount}張</div>
          <div className="w-1/12 min-w-[70px] p-1 break-words">{v.closeDate}</div>
          <div className="w-1/12 min-w-[70px] p-1">詳情</div>
        </div>
      ))}
    </div>
  );
};

export default Instant;
