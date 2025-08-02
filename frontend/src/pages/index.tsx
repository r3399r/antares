import { InstantStat } from '@/model/Instant';
import { getInstants } from '@/service/instantService';
import { bn, bnFormat } from '@/util/bignumber';
import { compare } from '@/util/compare';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import IcLogo from '@/images/ic-logo.svg';
import PicBanner from '@/images/pic-banner.png';
import IcSortAsc from '@/images/ic-sort-asc.svg';
import IcSortDesc from '@/images/ic-sort-desc.svg';
import IcSort from '@/images/ic-sort.svg';
import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Alert, Modal, Slide, SlideProps, Snackbar } from '@mui/material';
import { FacebookIcon, FacebookShareButton, LineIcon, LineShareButton } from 'react-share';
import ShareIcon from '@mui/icons-material/Share';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const url = 'https://lottery.celestialstudio.net/';

const SlideTransition = (props: SlideProps) => <Slide {...props} direction="up" />;

const Home = () => {
  const [sort, setSort] = useState<keyof InstantStat>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [openIdx, setOpenIdx] = useState<number>();
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => getInstants().sort(compare(sort, order)), [sort, order]);
  const target = useMemo(() => (openIdx !== undefined ? stats[openIdx] : null), [stats, openIdx]);

  const totalPrize = useMemo(
    () => target?.structure.reduce((p, c) => bn(c.prize).times(c.count).plus(p), bn(0)) ?? bn(0),
    [target],
  );
  const totalRevenue = useMemo(
    () => (target ? bn(target.price).times(target.total) : bn(0)),
    [target],
  );
  const feedbackRate = useMemo(
    () => totalPrize.div(totalRevenue).times(100),
    [totalPrize, totalRevenue],
  );

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
        <title>刮刮樂機率分析，最容易中獎的是這一個！尋找最適合你的刮刮樂 | Celestial Studio</title>
        <meta
          name="description"
          content={`每款刮刮樂有著不同的中獎率，除了中獎率之外，還有勝率、回本率、期望值等機率數值，利用樂透官方網站提供的數據進行計算，每週自動更新，無論你尋求的是高勝率或是高中獎率，這裡會讓你找到最適合的刮刮樂！現在就利用這個表格，找尋最高勝率的刮刮樂吧！上市中的刮刮樂主題有${stats
            .map((v) => v.topic)
            .join(',')}`}
        />
        <meta
          name="google-site-verification"
          content="VZYlmjm2nQXB01Ifn3vwk9X9z0b9wWCC7glkeOpWZlg"
        />
        <script type="application/ld+json">
          {`
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "什麼是刮刮樂?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "刮刮樂主要訴求在於提供即時性的樂趣，消費者刮開可立即得知是否中獎與中獎金額，豐富多樣化的遊戲主題、券面設計及視覺色彩，刮開過程中可體驗不同的玩法及樂趣"
        }
      }
    ]
}
`}
        </script>
        <script type="application/ld+json">
          {`
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "刮刮樂機率分析",
  "url": "https://lottery.celestialstudio.net/",
  "description": "最完整的台灣刮刮樂機率分析、勝率、回本率、期望值，每週自動更新。",
  "inLanguage": "zh-TW",
  "headline": "刮刮樂機率分析，最容易中獎的是這一個！",
  "datePublished": ${new Date().toISOString()},
  "dateModified": ${new Date().toISOString()}
}
`}
        </script>
      </Head>
      <div>
        <div className="my-2 flex h-[50px] items-center justify-center gap-2">
          <Image src={IcLogo} alt="logo" className="h-full" />
          <h1 className="text-2xl font-bold">刮刮樂機率分析</h1>
          <div className="cursor-pointer">
            <CopyToClipboard text={url} onCopy={() => setOpen(true)}>
              <ShareIcon />
            </CopyToClipboard>
          </div>
          <FacebookShareButton url={url}>
            <FacebookIcon size={30} round />
          </FacebookShareButton>
          <LineShareButton url={url}>
            <LineIcon size={30} round />
          </LineShareButton>
        </div>
        <div className="mb-[22px] h-[calc(90vh-50px)] overflow-x-auto pb-2">
          <div className="sticky top-0 z-30 flex min-w-[1245px] bg-red text-center font-bold text-white">
            <div
              className="sticky left-0 z-20 box-border flex h-full w-[calc(100%/11)] min-w-[130px] cursor-pointer items-center justify-center bg-persimmon px-1 py-5"
              onClick={() => click('id')}
            >
              <div>刮刮樂主題</div>
              <Image src={sortingImage('id')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-[calc(100%/11)] min-w-[75px] cursor-pointer items-center justify-center bg-persimmon px-1 py-5"
              onClick={() => click('price')}
            >
              <div>售價</div>
              <Image src={sortingImage('price')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-[calc(100%/11)] min-w-[150px] cursor-pointer items-center justify-center bg-persimmon px-1 py-5"
              onClick={() => click('totalW')}
            >
              <div>發行數量</div>
              <Image src={sortingImage('totalW')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-[calc(100%/11)] min-w-[100px] cursor-pointer items-center justify-center bg-plum px-1 py-5"
              onClick={() => click('bingoRate')}
            >
              <div>中獎率</div>
              <Image src={sortingImage('bingoRate')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-[calc(100%/11)] min-w-[100px] cursor-pointer items-center justify-center bg-coral px-1 py-5"
              onClick={() => click('winRate')}
            >
              <div>賺錢率</div>
              <Image src={sortingImage('winRate')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-[calc(100%/11)] min-w-[100px] cursor-pointer items-center justify-center bg-coral px-1 py-5"
              onClick={() => click('noLoseRate')}
            >
              <div>回本率</div>
              <Image src={sortingImage('noLoseRate')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-[calc(100%/11)] min-w-[100px] cursor-pointer items-center justify-center bg-coral px-1 py-5"
              onClick={() => click('winLoseRatio')}
            >
              <div>賺賠比</div>
              <Image src={sortingImage('winLoseRatio')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-[calc(100%/11)] min-w-[140px] cursor-pointer items-center justify-center bg-coral px-1 py-5"
              onClick={() => click('expect')}
            >
              <div>每百元期望值</div>
              <Image src={sortingImage('expect')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-[calc(100%/11)] min-w-[100px] cursor-pointer items-center justify-center bg-red px-1 py-5"
              onClick={() => click('topPrize')}
            >
              <div>頭獎獎金</div>
              <Image src={sortingImage('topPrize')} alt="sort" />
            </div>
            <div
              className="box-border flex h-full w-[calc(100%/11)] min-w-[100px] cursor-pointer items-center justify-center bg-red px-1 py-5"
              onClick={() => click('topCount')}
            >
              <div>頭獎數量</div>
              <Image src={sortingImage('topCount')} alt="sort" />
            </div>
            <div className="box-border h-full w-[calc(100%/11)] min-w-[150px]"></div>
          </div>
          {stats?.map((v, i) => (
            <div
              key={v.id}
              className={classNames('flex min-w-[1245px] text-center text-brown', {
                'bg-yellow': i % 2 === 0,
                'bg-white': i % 2 === 1,
              })}
            >
              <div
                className={classNames(
                  'sticky left-0 z-20 box-border w-[calc(100%/11)] min-w-[130px] px-1 py-2 font-bold',
                  {
                    'bg-yellow': i % 2 === 0,
                    'bg-white': i % 2 === 1,
                  },
                )}
              >
                {v.topic}
              </div>
              <div className="box-border w-[calc(100%/11)] min-w-[75px] px-1 py-2">${v.price}</div>
              <div className="box-border w-[calc(100%/11)] min-w-[150px] px-1 py-2">
                {v.totalW}萬{v.totalR === 0 ? '' : v.totalR}張
              </div>
              <div className="relative box-border w-[calc(100%/11)] min-w-[100px] px-1 py-2">
                <div className="relative z-10">{bn(v.bingoRate).toFixed(2)}%</div>
                <span
                  className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                  style={{ width: `calc((100% - 8px)*${v.bingoRate / 100})` }}
                />
              </div>
              <div className="relative box-border w-[calc(100%/11)] min-w-[100px] px-1 py-2">
                <div className="relative z-10">{bn(v.winRate).toFixed(2)}%</div>
                <span
                  className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                  style={{ width: `calc((100% - 8px)*${v.winRate / 50})` }}
                />
              </div>
              <div className="relative box-border w-[calc(100%/11)] min-w-[100px] px-1 py-2">
                <div className="relative z-10">{bn(v.noLoseRate).toFixed(2)}%</div>
                <span
                  className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                  style={{ width: `calc((100% - 8px)*${v.noLoseRate / 100})` }}
                />
              </div>
              <div className="relative box-border w-[calc(100%/11)] min-w-[100px] px-1 py-2">
                <div className="relative z-10">{bn(v.winLoseRatio).toFixed(2)}</div>
                <span
                  className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                  style={{ width: `calc((100% - 8px)*${v.winLoseRatio / 6})` }}
                />
              </div>
              <div className="relative box-border w-[calc(100%/11)] min-w-[140px] px-1 py-2">
                <div className="relative z-10">${bn(v.expect).toFixed(2)}</div>
                <span
                  className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                  style={{ width: `calc((100% - 8px)*${v.expect / 100})` }}
                />
              </div>
              <div className="box-border w-[calc(100%/11)] min-w-[100px] px-1 py-2">
                ${v.topPrize}萬
              </div>
              <div className="box-border w-[calc(100%/11)] min-w-[100px] px-1 py-2">
                {v.topCount}張
              </div>
              <div
                className="box-border w-[calc(100%/11)] min-w-[150px] px-1 py-2"
                onClick={() => setOpenIdx(i)}
              >
                <div className="cursor-pointer text-weissbier underline">點我看更多</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-honey py-5 md:p-5">
          <p className="text-center">↓↓ 如果你喜歡這個表格，可以小額支持我們 ↓↓</p>
          <div className="flex justify-center pb-4">
            <a href="https://p.ecpay.com.tw/38158C6" target="_blank">
              <Image alt="點擊圖片支持我們" src={PicBanner} />
            </a>
          </div>
          <div className="box-border bg-white px-8 py-6 sm:px-[60px] sm:py-10">
            <div className="flex items-center gap-4">
              <Image src={IcLogo} alt="logo" />
              <h1 className="text-4xl font-bold">刮刮樂機率分析</h1>
            </div>
            <p className="my-4">點擊標頭可以排序，尋找最符合自己需求的刮刮樂。</p>
            <div className="flex flex-col gap-2">
              <p>
                <b>中獎率：</b>刮出獎金的機率
              </p>
              <p>
                <b>賺錢率：</b>「刮出獎金」大於「遊戲售價」的機率
              </p>
              <p>
                <b>回本率：</b>「刮出獎金」大於或等於「遊戲售價」的機率
              </p>
              <p>
                <b>賺賠比：</b>「賺錢時平均賺到的錢」與「賠錢時平均賠掉的錢」的比值。若賺賠比為
                3，表示贏 1 次可以抵過輸 3 次，可搭配賺錢率決定購買策略
              </p>
              <p>
                <b>期望值：</b>平均一張刮刮樂可獲得之獎金
              </p>
            </div>
            <p className="my-4">
              此網頁每週自動至台灣彩券官網取得最新資料並更新。若資料有出入歡迎到 FB 粉專回報給作者。
            </p>
            <p className="text-xl font-bold">聯絡我們</p>
            <Link
              className="text-weissbier underline"
              href="https://www.facebook.com/profile.php?id=61556638474638"
              target="_blank"
            >
              Facebook
            </Link>
          </div>
          <p className="mt-4 text-center text-sm">Copyright © 2022 Celestial Studio</p>
        </div>
      </div>
      <Modal open={openIdx !== undefined} onClose={() => setOpenIdx(undefined)}>
        <div className="absolute left-1/2 top-1/2 max-h-[calc(100vh-140px)] w-[640px] max-w-[calc(100vw-30px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-5 outline-none">
          <h2 className="text-3xl font-bold">{target?.topic}</h2>
          <div className="mt-4 flex flex-col gap-2">
            <p>
              <b>發行日：</b>
              {target?.releasedAt}
            </p>
            <p>
              <b>下市日：</b>
              {target?.closedAt}
            </p>
            <p>
              <b>總獎金：</b>${totalPrize.toFormat()}
            </p>
            <p>
              <b>總營業額：</b>${totalRevenue.toFormat()}
            </p>
            <p>
              <b>總回饋率：</b>
              {feedbackRate.toFormat(2)}%
            </p>
            {target && (
              <p>
                <b>賺錢時平均賺：</b>${bn(target.expectWin).dp(2).toFormat()}
              </p>
            )}
            {target && (
              <p>
                <b>賠錢時平均賠：</b>${bn(target.expectLose).dp(2).toFormat()}
              </p>
            )}
            <p>
              <b>
                獎金結構：
                <b />
              </b>
            </p>
            <div>
              <div className="flex bg-persimmon p-2 text-center font-bold text-white">
                <div className="w-1/3">獎項</div>
                <div className="w-1/3">張數</div>
                <div className="w-1/3">機率</div>
              </div>
              {target?.structure.sort(compare('prize', 'desc')).map((v, i) => (
                <div
                  key={i}
                  className={classNames('flex text-center', {
                    'bg-yellow': i % 2 === 0,
                    'bg-white': i % 2 === 1,
                  })}
                >
                  <div className="w-1/3 px-1 py-2">${bnFormat(v.prize)}</div>
                  <div className="w-1/3 px-1 py-2">{bnFormat(v.count)}</div>
                  <div className="relative w-1/3 px-1 py-2">
                    <div className="relative z-10">
                      {bn(v.count).div(target.total).times(100).toFixed(5)}%
                    </div>
                    <span
                      className="absolute inset-y-0 left-1 my-1 rounded-sm bg-gold"
                      style={{
                        width: `calc((100% - 8px)*${bn(Math.log(v.count))
                          .div(Math.log(target.total))
                          .toNumber()})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        TransitionComponent={SlideTransition}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          已複製網址
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
