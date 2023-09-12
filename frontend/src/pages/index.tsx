import { InstantStat } from '@/model/Instant';
import { getInstants } from '@/service/instantService';
import { bn } from '@/util/bignumber';
import { compare } from '@/util/compare';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

const Home = () => {
  const [sort, setSort] = useState<keyof InstantStat>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const stats = useMemo(() => getInstants().sort(compare(sort, order)), [sort, order]);

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
        <title>刮刮樂機率分析</title>
        <meta name="description" content="刮刮樂機率全分析，尋找最適合入手的刮刮樂" />
        <meta
          name="google-site-verification"
          content="VZYlmjm2nQXB01Ifn3vwk9X9z0b9wWCC7glkeOpWZlg"
        />
      </Head>
      <div className="min-h-screen overflow-x-auto bg-red-700 py-5">
        <div className="mx-auto flex h-[64px] min-w-[1000px] max-w-[1440px] items-center text-center font-bold text-yellow-50">
          <div
            className="sticky left-0 box-border flex h-full w-1/6 min-w-[150px] cursor-pointer items-center justify-center border-r-[1px] border-r-gray-800 bg-orange-500 px-1"
            onClick={() => click('id')}
          >
            刮刮樂主題{sort === 'id' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
          <div
            className="box-border flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-orange-500 px-1"
            onClick={() => click('price')}
          >
            售價{sort === 'price' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
          <div
            className="box-border flex h-full w-1/12 min-w-[150px] cursor-pointer items-center justify-center bg-orange-500 px-1"
            onClick={() => click('totalW')}
          >
            發行數量{sort === 'totalW' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
          <div
            className="box-border flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-orange-900 px-1"
            onClick={() => click('bingoRate')}
          >
            中獎率{sort === 'bingoRate' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
          <div
            className="box-border flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-red-400 px-1"
            onClick={() => click('winRate')}
          >
            勝率{sort === 'winRate' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
          <div
            className="box-border flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-red-400 px-1"
            onClick={() => click('noLoseRate')}
          >
            回本率{sort === 'noLoseRate' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
          <div
            className="box-border flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-red-400 px-1"
            onClick={() => click('expect')}
          >
            每百元期望值{sort === 'expect' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
          <div
            className="box-border flex h-full w-1/12 min-w-[100px] cursor-pointer items-center justify-center bg-red-500 px-1"
            onClick={() => click('topPrize')}
          >
            頭獎獎金{sort === 'topPrize' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
          <div
            className="box-border flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-red-500 px-1"
            onClick={() => click('topCount')}
          >
            頭獎數量{sort === 'topCount' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
          <div
            className="box-border flex h-full w-1/6 min-w-[150px] cursor-pointer items-center justify-center bg-red-500 px-1"
            onClick={() => click('closedAt')}
          >
            下市日{sort === 'closedAt' && <span>{order === 'asc' ? '↓' : '↑'}</span>}
          </div>
        </div>
        {stats?.map((v, i) => (
          <div
            key={v.id}
            className={classNames(
              'mx-auto box-border flex min-w-[1000px] max-w-[1440px] items-center text-center text-orange-900',
              {
                'bg-yellow-200': i % 2 === 0,
                'bg-yellow-100': i % 2 === 1,
              },
            )}
          >
            <div
              className={classNames(
                'sticky left-0 z-20 box-border w-1/6 min-w-[150px] border-r-[1px] border-r-gray-800 p-1 font-bold',
                {
                  'bg-yellow-200': i % 2 === 0,
                  'bg-yellow-100': i % 2 === 1,
                },
              )}
            >
              {v.topic}
            </div>
            <div className="box-border w-1/12 min-w-[75px] p-1">{v.price}元</div>
            <div className="box-border w-1/12 min-w-[150px] p-1">
              {v.totalW}萬{v.totalR === 0 ? '' : v.totalR}張
            </div>
            <div className="relative box-border w-1/12 min-w-[75px] p-1">
              <div className="relative z-10">{bn(v.bingoRate).toFixed(2)}%</div>
              <span
                className="absolute inset-y-0 left-1 my-1 rounded-sm bg-yellow-400 opacity-95"
                style={{ width: `calc((100% - 8px)*${v.bingoRate / 100})` }}
              />
            </div>
            <div className="relative box-border w-1/12 min-w-[75px] p-1">
              <div className="relative z-10">{bn(v.winRate).toFixed(2)}%</div>
              <span
                className="absolute inset-y-0 left-1 my-1 rounded-sm bg-yellow-400 opacity-95"
                style={{ width: `calc((100% - 8px)*${v.winRate / 50})` }}
              />
            </div>
            <div className="relative box-border w-1/12 min-w-[75px] p-1">
              <div className="relative z-10">{bn(v.noLoseRate).toFixed(2)}%</div>
              <span
                className="absolute inset-y-0 left-1 my-1 rounded-sm bg-yellow-400 opacity-95"
                style={{ width: `calc((100% - 8px)*${v.noLoseRate / 100})` }}
              />
            </div>
            <div className="box-border w-1/12 min-w-[75px] p-1">{bn(v.expect).toFixed(2)}元</div>
            <div className="box-border w-1/12 min-w-[100px] p-1">{v.topPrize}萬元</div>
            <div className="box-border w-1/12 min-w-[75px] p-1">{v.topCount}張</div>
            <div className="box-border w-1/6 min-w-[150px] p-1">{v.closedAt}</div>
          </div>
        ))}
        <div className="mx-6 mt-4 box-border max-w-[1440px] rounded-2xl bg-yellow-50 px-10 py-4 xl:mx-auto">
          <h1>刮刮樂機率分析</h1>
          <p>點擊標頭可以排序，尋找最符合自己需求的刮刮樂。</p>
          <p>
            中獎率：刮出獎金的機率
            <br />
            勝率：刮出獎金大於遊戲售價的機率
            <br />
            回本率：刮出獎金大於或等於遊戲售價的機率
            <br />
            期望值：平均一張刮刮樂可獲得之獎金
          </p>
          <p>此網頁自動於每週五 17:30 至台灣彩券官網取得最新資料並更新。</p>
          <Link href="https://github.com/r3399r/antares" target="_blank">
            Github
          </Link>
          <p className="text-center">Copyright © 2022 Celestial Studio</p>
        </div>
      </div>
    </>
  );
};

export default Home;
