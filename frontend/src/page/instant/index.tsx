import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { InstantStat } from 'src/model/Instant';
import { getStats } from 'src/service/instantService';
import { bn } from 'src/util/bignumber';

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
    <div className="overflow-x-auto min-h-screen py-5 bg-red-700">
      <div className="flex items-center text-center min-w-[900px] max-w-[1440px] h-[64px] mx-auto bg-red-500 text-yellow-50 font-bold">
        <div
          className="w-1/6 min-w-[150px] h-full cursor-pointer bg-orange-500 flex items-center justify-center"
          onClick={() => click('id')}
        >
          <div className="p-1">刮刮樂主題{sort === 'id' && <span>↓</span>}</div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-orange-500 flex items-center justify-center"
          onClick={() => click('cost')}
        >
          <div className="p-1">售價{sort === 'cost' && <span>↓</span>}</div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-orange-500 flex items-center justify-center"
          onClick={() => click('totalW')}
        >
          <div className="p-1">發行數量{sort === 'totalW' && <span>↓</span>}</div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-orange-900 flex items-center justify-center"
          onClick={() => click('bingoRate')}
        >
          <div className="p-1">中獎率{sort === 'bingoRate' && <span>↓</span>}</div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-red-400 flex items-center justify-center"
          onClick={() => click('winRate')}
        >
          <div className="p-1">勝率{sort === 'winRate' && <span>↓</span>}</div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-red-400 flex items-center justify-center"
          onClick={() => click('noLoseRate')}
        >
          <div className="p-1">回本率{sort === 'noLoseRate' && <span>↓</span>}</div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-red-400 flex items-center justify-center"
          onClick={() => click('expect')}
        >
          <div className="p-1">每百元期望值{sort === 'expect' && <span>↓</span>}</div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer flex items-center justify-center"
          onClick={() => click('topPrize')}
        >
          <div className="p-1">頭獎獎金{sort === 'topPrize' && <span>↓</span>}</div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer flex items-center justify-center"
          onClick={() => click('topCount')}
        >
          <div className="p-1">頭獎數量{sort === 'topCount' && <span>↓</span>}</div>
        </div>
        <div
          className="w-1/6 min-w-[150px] h-full cursor-pointer flex items-center justify-center"
          onClick={() => click('closeDate')}
        >
          <div className="p-1">下市日{sort === 'closeDate' && <span>↓</span>}</div>
        </div>
      </div>
      {stats?.map((v, i) => (
        <div
          key={v.id}
          className={classNames(
            'flex items-center text-center min-w-[900px] max-w-[1440px] mx-auto text-orange-900',
            {
              'bg-yellow-200': i % 2 === 0,
              'bg-yellow-100': i % 2 === 1,
            },
          )}
        >
          <div className="w-1/6 min-w-[150px] p-1 font-bold">{v.topic}</div>
          <div className="w-1/12 min-w-[75px] p-1">{v.cost}元</div>
          <div className="w-1/12 min-w-[75px] p-1">
            {v.totalW}萬{v.totalR === 0 ? '' : v.totalR}張
          </div>
          <div className="w-1/12 min-w-[75px] p-1 relative">
            <div className="relative z-10">{bn(v.bingoRate).toFixed(2)}%</div>
            <span
              className="bg-yellow-400 opacity-95 my-1 absolute top-0 left-1 bottom-0 rounded-sm"
              style={{ width: `calc((100% - 8px)*${v.bingoRate / 100})` }}
            />
          </div>
          <div className="w-1/12 min-w-[75px] p-1 relative">
            <div className="relative z-10">{bn(v.winRate).toFixed(2)}%</div>
            <span
              className="bg-yellow-400 opacity-95 my-1 absolute top-0 left-1 bottom-0 rounded-sm"
              style={{ width: `calc((100% - 8px)*${v.winRate / 100})` }}
            />
          </div>
          <div className="w-1/12 min-w-[75px] p-1 relative">
            <div className="relative z-10">{bn(v.noLoseRate).toFixed(2)}%</div>
            <span
              className="bg-yellow-400 opacity-95 my-1 absolute top-0 left-1 bottom-0 rounded-sm"
              style={{ width: `calc((100% - 8px)*${v.noLoseRate / 100})` }}
            />
          </div>
          <div className="w-1/12 min-w-[75px] p-1">{bn(v.expect).toFixed(2)}元</div>
          <div className="w-1/12 min-w-[75px] p-1">{v.topPrize}萬元</div>
          <div className="w-1/12 min-w-[75px] p-1">{v.topCount}張</div>
          <div className="w-1/6 min-w-[150px] p-1">{v.closeDate}</div>
        </div>
      ))}
    </div>
  );
};

export default Instant;
