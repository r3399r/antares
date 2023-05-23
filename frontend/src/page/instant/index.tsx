import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { InstantStat } from 'src/model/Instant';
import { getInstants } from 'src/service/instantService';
import { bn } from 'src/util/bignumber';
import { compare } from 'src/util/compare';

const Instant = () => {
  const [stats, setStats] = useState<InstantStat[]>();
  const [sort, setSort] = useState<keyof InstantStat>('serial');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    getInstants().then((res) => setStats(res));
  }, []);

  useEffect(() => {
    if (stats === undefined) return;
    setStats(stats.sort(compare(sort, order)));
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
      <div className="flex items-center text-center min-w-[1000px] max-w-[1440px] h-[64px] mx-auto bg-red-500 text-yellow-50 font-bold">
        <div
          className="w-1/6 min-w-[150px] h-full cursor-pointer bg-orange-500 flex items-center justify-center sticky left-0 border-r-[1px] border-r-gray-800"
          onClick={() => click('serial')}
        >
          <div className="p-1">
            刮刮樂主題{sort === 'serial' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-orange-500 flex items-center justify-center"
          onClick={() => click('cost')}
        >
          <div className="p-1">
            售價{sort === 'cost' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        <div
          className="w-1/12 min-w-[150px] h-full cursor-pointer bg-orange-500 flex items-center justify-center"
          onClick={() => click('totalW')}
        >
          <div className="p-1">
            發行數量{sort === 'totalW' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-orange-900 flex items-center justify-center"
          onClick={() => click('bingoRate')}
        >
          <div className="p-1">
            中獎率{sort === 'bingoRate' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-red-400 flex items-center justify-center"
          onClick={() => click('winRate')}
        >
          <div className="p-1">
            勝率{sort === 'winRate' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-red-400 flex items-center justify-center"
          onClick={() => click('noLoseRate')}
        >
          <div className="p-1">
            回本率{sort === 'noLoseRate' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer bg-red-400 flex items-center justify-center"
          onClick={() => click('expect')}
        >
          <div className="p-1">
            每百元期望值{sort === 'expect' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        <div
          className="w-1/12 min-w-[100px] h-full cursor-pointer flex items-center justify-center"
          onClick={() => click('topPrize')}
        >
          <div className="p-1">
            頭獎獎金{sort === 'topPrize' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        <div
          className="w-1/12 min-w-[75px] h-full cursor-pointer flex items-center justify-center"
          onClick={() => click('topCount')}
        >
          <div className="p-1">
            頭獎數量{sort === 'topCount' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        <div
          className="w-1/6 min-w-[150px] h-full cursor-pointer flex items-center justify-center"
          onClick={() => click('closedAt')}
        >
          <div className="p-1">
            下市日{sort === 'closedAt' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
      </div>
      {stats?.map((v, i) => (
        <div
          key={v.id}
          className={classNames(
            'flex items-center text-center min-w-[1000px] max-w-[1440px] mx-auto text-orange-900',
            {
              'bg-yellow-200': i % 2 === 0,
              'bg-yellow-100': i % 2 === 1,
            },
          )}
        >
          <div
            className={classNames(
              'w-1/6 min-w-[150px] p-1 font-bold sticky left-0 border-r-[1px] border-r-gray-800 z-20',
              {
                'bg-yellow-200': i % 2 === 0,
                'bg-yellow-100': i % 2 === 1,
              },
            )}
          >
            {v.topic}
          </div>
          <div className="w-1/12 min-w-[75px] p-1">{v.cost}元</div>
          <div className="w-1/12 min-w-[150px] p-1">
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
              style={{ width: `calc((100% - 8px)*${v.winRate / 50})` }}
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
          <div className="w-1/12 min-w-[100px] p-1">{v.topPrize}萬元</div>
          <div className="w-1/12 min-w-[75px] p-1">{v.topCount}張</div>
          <div className="w-1/6 min-w-[150px] p-1">{v.closedAt}</div>
        </div>
      ))}
    </div>
  );
};

export default Instant;
