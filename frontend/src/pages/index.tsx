import { InstantStat } from '@/model/Instant';
import { getInstants } from '@/service/instantService';
import { bn } from '@/util/bignumber';
import { compare } from '@/util/compare';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import IcLogo from '@/images/ic-logo.svg';
import IcSortAsc from '@/images/ic-sort-asc.svg';
import IcSortDesc from '@/images/ic-sort-desc.svg';
import IcSort from '@/images/ic-sort.svg';
import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';

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

  const sortingImage = useCallback(
    (key: keyof InstantStat) => {
      if (sort !== key) return IcSort;
      if (order === 'asc') return IcSortAsc;

      return IcSortDesc;
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
      <div>
        <div className="mb-[22px] mt-10 overflow-x-auto pb-2">
          <div className="flex min-w-[1165px] text-center font-semibold text-white">
            <div
              className="sticky left-0 box-border flex h-full w-1/6 min-w-[150px] cursor-pointer items-center justify-center border-0 border-r border-solid border-r-brown bg-persimmon px-1 py-5"
              onClick={() => click('id')}
            >
              <div>刮刮樂主題</div>
              <Image src={sortingImage('id')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-1/12 min-w-[75px] cursor-pointer items-center justify-center bg-persimmon px-1 py-5"
              onClick={() => click('price')}
            >
              <div>售價</div>
              <Image src={sortingImage('price')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-1/12 min-w-[150px] cursor-pointer items-center justify-center bg-persimmon px-1 py-5"
              onClick={() => click('totalW')}
            >
              <div>發行數量</div>
              <Image src={sortingImage('totalW')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-1/12 min-w-[100px] cursor-pointer items-center justify-center bg-plum px-1 py-5"
              onClick={() => click('bingoRate')}
            >
              <div>中獎率</div>
              <Image src={sortingImage('bingoRate')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-1/12 min-w-[100px] cursor-pointer items-center justify-center bg-coral px-1 py-5"
              onClick={() => click('winRate')}
            >
              <div>勝率</div>
              <Image src={sortingImage('winRate')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-1/12 min-w-[100px] cursor-pointer items-center justify-center bg-coral px-1 py-5"
              onClick={() => click('noLoseRate')}
            >
              <div>回本率</div>
              <Image src={sortingImage('noLoseRate')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-1/12 min-w-[140px] cursor-pointer items-center justify-center bg-coral px-1 py-5"
              onClick={() => click('expect')}
            >
              <div>每百元期望值</div>
              <Image src={sortingImage('expect')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-1/12 min-w-[100px] cursor-pointer items-center justify-center bg-red px-1 py-5"
              onClick={() => click('topPrize')}
            >
              <div>頭獎獎金</div>
              <Image src={sortingImage('topPrize')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-1/12 min-w-[100px] cursor-pointer items-center justify-center bg-red px-1 py-5"
              onClick={() => click('topCount')}
            >
              <div>頭獎數量</div>
              <Image src={sortingImage('topCount')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-1/6 min-w-[150px] cursor-pointer items-center justify-center bg-red px-1 py-5"
              onClick={() => click('closedAt')}
            >
              <div>下市日</div>
              <Image src={sortingImage('closedAt')} alt="sort" />
            </div>
          </div>
          {stats?.map((v, i) => (
            <div
              key={v.id}
              className={classNames('flex min-w-[1165px] text-center text-brown', {
                'bg-yellow': i % 2 === 0,
                'bg-white': i % 2 === 1,
              })}
            >
              <div
                className={classNames(
                  'sticky left-0 z-20 box-border w-1/6 min-w-[150px] border-0 border-r border-solid border-r-brown px-1 py-2 font-semibold',
                  {
                    'bg-yellow': i % 2 === 0,
                    'bg-white': i % 2 === 1,
                  },
                )}
              >
                {v.topic}
              </div>
              <div className="box-border w-1/12 min-w-[75px] px-1 py-2">{v.price}元</div>
              <div className="box-border w-1/12 min-w-[150px] px-1 py-2">
                {v.totalW}萬{v.totalR === 0 ? '' : v.totalR}張
              </div>
              <div className="relative box-border w-1/12 min-w-[100px] px-1 py-2">
                <div className="relative z-10">{bn(v.bingoRate).toFixed(2)}%</div>
                <span
                  className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                  style={{ width: `calc((100% - 8px)*${v.bingoRate / 100})` }}
                />
              </div>
              <div className="relative box-border w-1/12 min-w-[100px] px-1 py-2">
                <div className="relative z-10">{bn(v.winRate).toFixed(2)}%</div>
                <span
                  className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                  style={{ width: `calc((100% - 8px)*${v.winRate / 50})` }}
                />
              </div>
              <div className="relative box-border w-1/12 min-w-[100px] px-1 py-2">
                <div className="relative z-10">{bn(v.noLoseRate).toFixed(2)}%</div>
                <span
                  className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                  style={{ width: `calc((100% - 8px)*${v.noLoseRate / 100})` }}
                />
              </div>
              <div className="relative box-border w-1/12 min-w-[140px] px-1 py-2">
                <div className="relative z-10">{bn(v.expect).toFixed(2)}元</div>
                <span
                  className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                  style={{ width: `calc((100% - 8px)*${v.expect / 100})` }}
                />
              </div>
              <div className="box-border w-1/12 min-w-[100px] px-1 py-2">{v.topPrize}萬元</div>
              <div className="box-border w-1/12 min-w-[100px] px-1 py-2">{v.topCount}張</div>
              <div className="box-border w-1/6 min-w-[150px] px-1 py-2">{v.closedAt}</div>
            </div>
          ))}
        </div>
        <div className="bg-honey p-10">
          <div className="box-border bg-white px-[60px] py-10">
            <div className="flex items-center gap-4">
              <Image src={IcLogo} alt="logo" />
              <h1 className="text-4xl font-bold">刮刮樂機率分析</h1>
            </div>
            <p className="my-4">點擊標頭可以排序，尋找最符合自己需求的刮刮樂。</p>
            <p>
              <b>中獎率：</b>刮出獎金的機率
              <br />
              <b>勝率：</b>刮出獎金大於遊戲售價的機率
              <br />
              <b>回本率：</b>刮出獎金大於或等於遊戲售價的機率
              <br />
              <b>期望值：</b>平均一張刮刮樂可獲得之獎金
            </p>
            <p className="my-4">此網頁自動於每週五 17:30 至台灣彩券官網取得最新資料並更新。</p>
            <Link
              className="text-weissbier underline"
              href="https://github.com/r3399r/antares"
              target="_blank"
            >
              Github
            </Link>
          </div>
          <p className="mt-4 text-center text-sm">Copyright © 2022 Celestial Studio</p>
        </div>
      </div>
    </>
  );
};

export default Home;
