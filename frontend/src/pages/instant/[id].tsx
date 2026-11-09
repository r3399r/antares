import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import { format } from 'date-fns';
import { InstantLink, InstantStat, toInstantLink } from '@/model/Instant';
import { getActiveInstants, getInstants } from '@/service/instantService';
import { bn, bnFormat } from '@/util/bignumber';
import { compare } from '@/util/compare';
import Seo from '@/components/Seo';
import InstantLinkList from '@/components/InstantLinkList';
import { ARCHIVE_PATH, SITE_URL, instantPath } from '@/constant/site';
import IcLogo from '@/images/ic-logo.svg';

type Props = {
  stat: InstantStat;
  related: InstantLink[];
  updatedAt: string;
};

export const getStaticPaths: GetStaticPaths = () => ({
  // Off-sale cards keep their page, so a URL that once ranked never 404s.
  paths: getInstants().map((v) => ({ params: { id: v.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
  const stat = getInstants().find((v) => v.id === params?.id);
  if (!stat) return { notFound: true };

  // Always link out to cards on sale: those are the pages worth sending readers
  // (and link equity) to, especially from an off-sale page.
  const related = getActiveInstants()
    .filter((v) => v.id !== stat.id)
    .sort((a, b) => Number(b.price === stat.price) - Number(a.price === stat.price))
    .slice(0, 8)
    .map(toInstantLink);

  return { props: { stat, related, updatedAt: format(new Date(), 'yyyy/MM/dd') } };
};

const oneIn = (total: number, count: number) =>
  count > 0 ? bn(total).div(count).dp(0).toFormat() : '-';

const InstantPage = ({ stat, related, updatedAt }: Props) => {
  const path = instantPath(stat.id);
  const totalPrize = stat.structure.reduce((p, c) => bn(c.prize).times(c.count).plus(p), bn(0));
  const totalRevenue = bn(stat.price).times(stat.total);
  const feedbackRate = totalRevenue.gt(0) ? totalPrize.div(totalRevenue).times(100) : bn(0);
  const structure = [...stat.structure].sort(compare('prize', 'desc'));
  const winning = structure.filter((v) => v.prize > 0);
  const bingoRate = bn(stat.bingoRate).toFixed(2);
  const winRate = bn(stat.winRate).toFixed(2);
  const expect = bn(stat.expect).toFixed(2);

  const title = stat.isExpired
    ? `${stat.topic}刮刮樂中獎率${bingoRate}%｜獎金結構與頭獎機率（第${stat.id}期・已下市）`
    : `${stat.topic}刮刮樂中獎率${bingoRate}%｜頭獎${stat.topPrize}萬機率、獎金結構分析（第${stat.id}期）`;

  const description = stat.isExpired
    ? `台灣彩券${stat.price}元刮刮樂「${stat.topic}」已於${
        stat.closedAt
      }下市。中獎率${bingoRate}%、賺錢率${winRate}%、每百元期望值$${expect}，頭獎${
        stat.topPrize
      }萬元共${stat.topCount}張。${
        stat.exchangeLastDate ? `兌獎期限至${stat.exchangeLastDate}，` : ''
      }完整獎金結構與各獎項中獎機率查詢。`
    : `台灣彩券${stat.price}元刮刮樂「${
        stat.topic
      }」中獎率${bingoRate}%、賺錢率${winRate}%、每百元期望值$${expect}。頭獎${
        stat.topPrize
      }萬元共${stat.topCount}張，約每${oneIn(
        stat.total,
        stat.topCount,
      )}張出現1張。完整獎金結構與各獎項中獎機率。`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '刮刮樂攻略', item: `${SITE_URL}/` },
        ...(stat.isExpired
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: '已下市刮刮樂',
                item: `${SITE_URL}${ARCHIVE_PATH}`,
              },
            ]
          : []),
        {
          '@type': 'ListItem',
          position: stat.isExpired ? 3 : 2,
          name: `${stat.topic}刮刮樂`,
          item: `${SITE_URL}${path}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: `${SITE_URL}${path}`,
      name: title,
      description,
      inLanguage: 'zh-Hant-TW',
      dateModified: new Date(updatedAt).toISOString(),
      primaryImageOfPage: stat.picPath || undefined,
      isPartOf: { '@type': 'WebSite', url: `${SITE_URL}/` },
    },
  ];

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={path}
        image={stat.picPath || undefined}
        imageAlt={`${stat.topic}刮刮樂券面`}
        jsonLd={jsonLd}
      />
      <div className="mx-auto max-w-[800px] p-4 text-brown">
        <div className="rounded-xl bg-white px-5 py-6 sm:px-10 sm:py-8">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 py-3 text-sm">
            <Link href="/" className="flex items-center gap-1 text-weissbier underline">
              <Image src={IcLogo} alt="" className="h-5 w-auto" />
              刮刮樂攻略
            </Link>
            <span>›</span>
            {stat.isExpired && (
              <>
                <Link href={ARCHIVE_PATH} className="text-weissbier underline">
                  已下市刮刮樂
                </Link>
                <span>›</span>
              </>
            )}
            <span>{stat.topic}</span>
          </nav>

          <h1 className="text-3xl font-bold">
            {stat.topic}刮刮樂中獎機率分析
            <span className="ml-2 align-middle text-base font-normal">
              第{stat.id}期{stat.isExpired ? '・已下市' : ''}
            </span>
          </h1>

          {stat.isExpired && (
            <p className="mt-3 rounded-lg bg-honey p-3">
              <b>此款已下市：</b>台灣彩券已於 {stat.closedAt} 停止販售「{stat.topic}」
              {stat.exchangeLastDate ? `，兌獎期限至 ${stat.exchangeLastDate}` : ''}。
              以下數據保留供查詢與核對獎金，想購買請參考{' '}
              <Link href="/" className="text-weissbier underline">
                目前販售中的刮刮樂
              </Link>
              。
            </p>
          )}

          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            {stat.picPath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={stat.picPath}
                alt={`${stat.topic}刮刮樂券面`}
                loading="eager"
                className="w-full rounded-lg sm:w-[280px] sm:shrink-0"
              />
            )}
            <p className="leading-7">
              「{stat.topic}」是台灣彩券於 {stat.releasedAt} 上市的 {stat.price} 元刮刮樂
              {stat.isExpired ? `，已於 ${stat.closedAt} 下市` : `，預計於 ${stat.closedAt} 下市`}，
              總共發行 {bn(stat.total).toFormat()} 張。頭獎獎金 {stat.topPrize} 萬元，共{' '}
              {stat.topCount} 張，平均約每 {oneIn(stat.total, stat.topCount)} 張才有 1 張頭獎。
              整體中獎率為 {bingoRate}%，但刮中金額超過售價（真正賺錢）的機率只有 {winRate}%； 每花
              100 元，平均可拿回約 ${expect}（已扣除超過 5,000 元獎金的 20.4% 稅金）。
            </p>
          </div>

          <h2 className="mt-8 text-2xl font-bold">{stat.topic}重點數據</h2>
          <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ['售價', `$${stat.price}`],
              ['發行張數', `${bn(stat.total).toFormat()} 張`],
              ['中獎率', `${bingoRate}%`],
              ['賺錢率', `${winRate}%`],
              ['回本率', `${bn(stat.noLoseRate).toFixed(2)}%`],
              ['賺賠比', bn(stat.winLoseRatio).toFixed(2)],
              ['每百元期望值', `$${expect}`],
              ['總回饋率', `${feedbackRate.toFormat(2)}%`],
              ['頭獎', `$${stat.topPrize}萬 × ${stat.topCount} 張`],
              ['賺錢時平均賺', `$${bn(stat.expectWin).dp(2).toFormat()}`],
              ['賠錢時平均賠', `$${bn(stat.expectLose).dp(2).toFormat()}`],
              ['上市日', stat.releasedAt],
              ['下市日', stat.closedAt],
              ...(stat.exchangeLastDate ? [['兌獎期限', stat.exchangeLastDate]] : []),
              ['總獎金', `$${totalPrize.toFormat()}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-yellow p-3">
                <dt className="text-sm">{k}</dt>
                <dd className="text-lg font-bold">{v}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 text-2xl font-bold">{stat.topic}獎金結構與各獎項中獎機率</h2>
          <table className="mt-3 w-full text-center">
            <thead>
              <tr className="bg-persimmon text-white">
                <th className="p-2">獎項</th>
                <th className="p-2">張數</th>
                <th className="p-2">機率</th>
                <th className="p-2">約每幾張中 1 張</th>
              </tr>
            </thead>
            <tbody>
              {structure.map((v, i) => (
                <tr
                  key={v.prize}
                  className={classNames({ 'bg-yellow': i % 2 === 0, 'bg-white': i % 2 === 1 })}
                >
                  <td className="p-2">{v.prize === 0 ? '未中獎' : `$${bnFormat(v.prize)}`}</td>
                  <td className="p-2">{bnFormat(v.count)}</td>
                  <td className="p-2">{bn(v.count).div(stat.total).times(100).toFixed(5)}%</td>
                  <td className="p-2">{oneIn(stat.total, v.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {winning.length === 0 && <p className="mt-2">台灣彩券尚未公布此款的獎金結構。</p>}

          <h2 className="mt-8 text-2xl font-bold">目前販售中的刮刮樂</h2>
          <InstantLinkList items={related} />
          <p className="mt-4 flex flex-wrap gap-4">
            <Link href="/" className="text-weissbier underline">
              查看全部刮刮樂中獎率排行 →
            </Link>
            <Link href={ARCHIVE_PATH} className="text-weissbier underline">
              查看已下市刮刮樂 →
            </Link>
          </p>

          <p className="mt-8 text-sm">
            資料來源：台灣彩券官網，每週自動更新，最後更新 {updatedAt}。
          </p>
        </div>
      </div>
    </>
  );
};

export default InstantPage;
