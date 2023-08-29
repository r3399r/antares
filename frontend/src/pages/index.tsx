import { InstantStat } from '@/model/Instant';
import { getInstants } from '@/service/instantService';
import { bn } from '@/util/bignumber';
import { compare } from '@/util/compare';
import classNames from 'classnames';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

const Home = () => {
  const [stats, setStats] = useState<InstantStat[]>(getInstants());
  const [sort, setSort] = useState<keyof InstantStat>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (stats === undefined) return;
    setStats([...stats].sort(compare(sort, order)));
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
    <>
      <Head>
        <title>刮刮樂資訊</title>
        <meta name="description" content="刮刮樂機率全分析，尋找最適合入手的刮刮樂" />
      </Head>
      <div className="min-h-screen overflow-x-auto bg-red-700 py-5">
        <div className="mx-auto flex h-[64px] min-w-[1000px] max-w-[1440px] items-center bg-red-500 text-center font-bold text-yellow-50">
          <div
            className="sticky left-0 flex h-full w-1/6 min-w-[150px] cursor-pointer items-center justify-center border-r-[1px] border-r-gray-800 bg-orange-500"
            onClick={() => click('id')}
          >
            <div className="p-1">
              刮刮樂主題{sort === 'id' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
            </div>
          </div>
          <div
            className="flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-orange-500"
            onClick={() => click('price')}
          >
            <div className="p-1">
              售價{sort === 'price' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
            </div>
          </div>
          <div
            className="flex h-full w-1/12 min-w-[150px] cursor-pointer items-center justify-center bg-orange-500"
            onClick={() => click('totalW')}
          >
            <div className="p-1">
              發行數量{sort === 'totalW' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
            </div>
          </div>
          <div
            className="flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-orange-900"
            onClick={() => click('bingoRate')}
          >
            <div className="p-1">
              中獎率{sort === 'bingoRate' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
            </div>
          </div>
          <div
            className="flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-red-400"
            onClick={() => click('winRate')}
          >
            <div className="p-1">
              勝率{sort === 'winRate' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
            </div>
          </div>
          <div
            className="flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-red-400"
            onClick={() => click('noLoseRate')}
          >
            <div className="p-1">
              回本率{sort === 'noLoseRate' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
            </div>
          </div>
          <div
            className="flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-red-400"
            onClick={() => click('expect')}
          >
            <div className="p-1">
              每百元期望值{sort === 'expect' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
            </div>
          </div>
          <div
            className="flex h-full w-1/12 min-w-[100px] cursor-pointer items-center justify-center"
            onClick={() => click('topPrize')}
          >
            <div className="p-1">
              頭獎獎金{sort === 'topPrize' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
            </div>
          </div>
          <div
            className="flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center"
            onClick={() => click('topCount')}
          >
            <div className="p-1">
              頭獎數量{sort === 'topCount' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
            </div>
          </div>
          <div
            className="flex h-full w-1/6 min-w-[150px] cursor-pointer items-center justify-center"
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
            <div className="w-1/12 min-w-[75px] p-1">{v.price}元</div>
            <div className="w-1/12 min-w-[150px] p-1">
              {v.totalW}萬{v.totalR === 0 ? '' : v.totalR}張
            </div>
            <div className="relative w-1/12 min-w-[75px] p-1">
              <div className="relative z-10">{bn(v.bingoRate).toFixed(2)}%</div>
              <span
                className="absolute inset-y-0 left-1 my-1 rounded-sm bg-yellow-400 opacity-95"
                style={{ width: `calc((100% - 8px)*${v.bingoRate / 100})` }}
              />
            </div>
            <div className="relative w-1/12 min-w-[75px] p-1">
              <div className="relative z-10">{bn(v.winRate).toFixed(2)}%</div>
              <span
                className="absolute inset-y-0 left-1 my-1 rounded-sm bg-yellow-400 opacity-95"
                style={{ width: `calc((100% - 8px)*${v.winRate / 50})` }}
              />
            </div>
            <div className="relative w-1/12 min-w-[75px] p-1">
              <div className="relative z-10">{bn(v.noLoseRate).toFixed(2)}%</div>
              <span
                className="absolute inset-y-0 left-1 my-1 rounded-sm bg-yellow-400 opacity-95"
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
    </>
  );
};

export default Home;
