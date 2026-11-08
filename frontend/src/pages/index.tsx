import { InstantLink, InstantStat, toInstantLink } from '@/model/Instant';
import { getActiveInstants, getExpiredInstants } from '@/service/instantService';
import { bn } from '@/util/bignumber';
import { compare } from '@/util/compare';
import classNames from 'classnames';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import IcLogo from '@/images/ic-logo.svg';
import PicBanner from '@/images/pic-banner.png';
import IcSortAsc from '@/images/ic-sort-asc.svg';
import IcSortDesc from '@/images/ic-sort-desc.svg';
import IcSort from '@/images/ic-sort.svg';
import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Alert, Slide, SlideProps, Snackbar } from '@mui/material';
import { FacebookIcon, FacebookShareButton, LineIcon, LineShareButton } from 'react-share';
import ShareIcon from '@mui/icons-material/Share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Seo from '@/components/Seo';
import InstantLinkList from '@/components/InstantLinkList';
import { ARCHIVE_PATH, LOGO_URL, SITE_URL, instantPath } from '@/constant/site';

const zodiac = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];

const SlideTransition = (props: SlideProps) => <Slide {...props} direction="up" />;

type Props = {
  instants: InstantStat[];
  recentlyClosed: InstantLink[];
  expiredCount: number;
  updatedAt: string;
  year: number;
};

// Computed at build time so the page HTML (and its dates) is fixed per deploy.
export const getStaticProps: GetStaticProps<Props> = () => {
  const now = new Date();
  const expired = getExpiredInstants();

  return {
    props: {
      // The ranking table compares what you can actually buy today.
      instants: getActiveInstants(),
      recentlyClosed: expired.slice(0, 12).map(toInstantLink),
      expiredCount: expired.length,
      updatedAt: format(now, 'yyyy/MM/dd'),
      year: now.getFullYear(),
    },
  };
};

/** Only the numeric stats can be ranked, so nullable fields stay out of `best`. */
type NumericStatKey = {
  [K in keyof InstantStat]: InstantStat[K] extends number ? K : never;
}[keyof InstantStat];

const best = (list: InstantStat[], key: NumericStatKey) =>
  list.reduce<InstantStat | undefined>((p, c) => (!p || c[key] > p[key] ? c : p), undefined);

const Home = ({ instants, recentlyClosed, expiredCount, updatedAt, year }: Props) => {
  const [sort, setSort] = useState<keyof InstantStat>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => [...instants].sort(compare(sort, order)), [instants, sort, order]);

  const url = `${SITE_URL}/`;
  const bestBingo = best(instants, 'bingoRate');
  const bestWin = best(instants, 'winRate');
  const bestExpect = best(instants, 'expect');
  const fmt = (v: InstantStat | undefined, key: NumericStatKey, unit: string) =>
    v ? `「${v.topic}」（${v.price}元，${bn(v[key]).toFixed(2)}${unit}）` : '';

  const title = `${year}${zodiac[(year - 4) % 12]}年刮刮樂攻略｜全${
    instants.length
  }款中獎率排行、賺錢率、期望值比較`;
  const description = `比較台灣彩券目前販售中全部${
    instants.length
  }款刮刮樂的中獎率、賺錢率、回本率與每百元期望值。${
    bestBingo ? `中獎率最高：${bestBingo.topic}（${bn(bestBingo.bingoRate).toFixed(1)}%）；` : ''
  }${
    bestExpect ? `期望值最高：${bestExpect.topic}；` : ''
  }點選各款可看完整獎金結構與頭獎機率，每週自動更新。`;

  const faq = [
    {
      q: '哪一款刮刮樂中獎率最高？',
      a: `目前販售中的刮刮樂，中獎率最高的是${fmt(
        bestBingo,
        'bingoRate',
        '%',
      )}。不過中獎率包含刮中與售價相同金額的「回本獎」，若想真正賺錢，請參考賺錢率。`,
    },
    {
      q: '哪一款刮刮樂賺錢機率最高？',
      a: `刮中金額大於售價的機率（賺錢率）最高的是${fmt(bestWin, 'winRate', '%')}。`,
    },
    {
      q: '買哪一款刮刮樂最划算？',
      a: `以每花 100 元平均可拿回的獎金（期望值，已扣除超過 5,000 元獎金的稅金）來看，目前最高的是${fmt(
        bestExpect,
        'expect',
        '元',
      )}。所有刮刮樂的期望值都低於 100 元，長期購買必定虧損，請量力而為。`,
    },
    {
      q: '目前熱賣中的刮刮樂有哪些？',
      a: `目前共有 ${instants.length} 款：${instants.map((v) => v.topic).join('、')}。`,
    },
    {
      q: '什麼是刮刮樂？',
      a: '刮刮樂是台灣彩券發行的即開型彩券，刮開券面即可立即得知是否中獎與中獎金額，每款有不同的遊戲主題、玩法與獎金結構。',
    },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url,
      name: '刮刮樂攻略',
      inLanguage: 'zh-Hant-TW',
      publisher: {
        '@type': 'Organization',
        name: 'Celestial Studio',
        logo: { '@type': 'ImageObject', url: LOGO_URL },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((v) => ({
        '@type': 'Question',
        name: v.q,
        acceptedAnswer: { '@type': 'Answer', text: v.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${year}刮刮樂中獎率排行`,
      itemListElement: instants.map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: v.topic,
        url: `${SITE_URL}${instantPath(v.id)}`,
      })),
    },
  ];

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
      <Seo
        title={title}
        description={description}
        path="/"
        image={instants[0]?.picPath || undefined}
        jsonLd={jsonLd}
      />
      <div>
        <div className="my-2 flex h-[50px] items-center justify-center gap-2">
          <Image src={IcLogo} alt="logo" className="h-full" />
          <h1 className="text-2xl font-bold">刮刮樂攻略，中獎機率一覽</h1>
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
                <Link href={instantPath(v.id)} className="hover:underline">
                  {v.topic}
                </Link>
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
              <div className="box-border w-[calc(100%/11)] min-w-[150px] px-1 py-2">
                <Link href={instantPath(v.id)} className="text-weissbier underline">
                  {v.topic}機率分析
                </Link>
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
              <h2 className="text-4xl font-bold">刮刮樂機率分析</h2>
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
              此網頁每週自動至台灣彩券官網取得最新資料並更新（最後更新：{updatedAt}
              ）。若資料有出入歡迎到 FB 粉專回報給作者。
            </p>
            <h2 className="mb-2 mt-6 text-2xl font-bold">刮刮樂常見問題</h2>
            <div className="mb-6 flex flex-col gap-4">
              {faq.map((v) => (
                <div key={v.q}>
                  <h3 className="font-bold">{v.q}</h3>
                  <p>{v.a}</p>
                </div>
              ))}
            </div>
            <h2 className="mb-2 mt-6 text-2xl font-bold">最近下市的刮刮樂</h2>
            <p>
              已下市的刮刮樂仍保留完整的中獎率與獎金結構，手上還有舊券可以用來核對獎金與兌獎期限。
            </p>
            <InstantLinkList items={recentlyClosed} showClosedAt />
            <p className="my-4">
              <Link href={ARCHIVE_PATH} className="text-weissbier underline">
                查看全部 {expiredCount} 款已下市刮刮樂 →
              </Link>
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
