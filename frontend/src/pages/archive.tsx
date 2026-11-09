import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { InstantLink, toInstantLink } from '@/model/Instant';
import { getActiveInstants, getExpiredInstants } from '@/service/instantService';
import Seo from '@/components/Seo';
import InstantLinkList from '@/components/InstantLinkList';
import { ARCHIVE_PATH, SITE_URL } from '@/constant/site';
import IcLogo from '@/images/ic-logo.svg';

type Group = { year: string; items: InstantLink[] };

type Props = { groups: Group[]; activeCount: number; total: number; updatedAt: string };

export const getStaticProps: GetStaticProps<Props> = () => {
  const expired = getExpiredInstants();
  const groups: Group[] = [];

  for (const v of expired) {
    const year = v.closedAt.slice(0, 4);
    const group = groups.find((g) => g.year === year);
    if (group) group.items.push(toInstantLink(v));
    else groups.push({ year, items: [toInstantLink(v)] });
  }

  return {
    props: {
      groups,
      activeCount: getActiveInstants().length,
      total: expired.length,
      updatedAt: format(new Date(), 'yyyy/MM/dd'),
    },
  };
};

const Archive = ({ groups, activeCount, total, updatedAt }: Props) => {
  const title = `已下市刮刮樂一覽｜歷年${total}款中獎率與獎金結構查詢`;
  const description = `台灣彩券已下市刮刮樂完整列表，共${total}款。查詢各款的中獎率、賺錢率、頭獎機率與完整獎金結構，手上還有舊券也能核對獎金與兌獎期限。`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '刮刮樂攻略', item: `${SITE_URL}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: '已下市刮刮樂',
          item: `${SITE_URL}${ARCHIVE_PATH}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      url: `${SITE_URL}${ARCHIVE_PATH}`,
      name: title,
      description,
      inLanguage: 'zh-Hant-TW',
      isPartOf: { '@type': 'WebSite', url: `${SITE_URL}/` },
    },
  ];

  return (
    <>
      <Seo title={title} description={description} path={ARCHIVE_PATH} jsonLd={jsonLd} />
      <div className="mx-auto max-w-[800px] p-4 text-brown">
        <div className="rounded-xl bg-white px-5 py-6 sm:px-10 sm:py-8">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 py-3 text-sm">
            <Link href="/" className="flex items-center gap-1 text-weissbier underline">
              <Image src={IcLogo} alt="" className="h-5 w-auto" />
              刮刮樂攻略
            </Link>
            <span>›</span>
            <span>已下市刮刮樂</span>
          </nav>

          <h1 className="text-3xl font-bold">已下市刮刮樂一覽</h1>
          <p className="mt-4 leading-7">
            這裡收錄台灣彩券已經停止販售的刮刮樂，共 {total} 款。每一款都保留完整的中獎率、賺錢率、
            頭獎機率與獎金結構，手上還有舊券時可以用來核對獎金與兌獎期限。想看目前還在販售的{' '}
            {activeCount} 款，請回到{' '}
            <Link href="/" className="text-weissbier underline">
              刮刮樂中獎率排行
            </Link>
            。
          </p>

          {groups.map((g) => (
            <section key={g.year}>
              <h2 className="mt-8 text-2xl font-bold">
                {g.year} 年下市（{g.items.length} 款）
              </h2>
              <InstantLinkList items={g.items} showClosedAt />
            </section>
          ))}

          <p className="mt-8 text-sm">
            資料來源：台灣彩券官網，每週自動更新，最後更新 {updatedAt}。
          </p>
        </div>
      </div>
    </>
  );
};

export default Archive;
