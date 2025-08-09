import Head from 'next/head';
import StatsTable from '@/components/StatsTable';
import { useMemo } from 'react';
import { getInstants } from '@/service/instantService';

export default function ArticlePage() {
  const stats = useMemo(() => getInstants(), []);

  return (
    <>
      <Head>
        <title>刮刮樂機率分析，最容易中獎的是這一個！尋找最適合你的刮刮樂 | Celestial Studio</title>
        <meta
          name="description"
          content={`每款刮刮樂有著不同的中獎率，除了中獎率之外，還有勝率、回本率、期望值等機率數值，利用樂透官方網站提供的數據進行計算，每週自動更新，無論你尋求的是高勝率或是高中獎率，這裡會讓你找到最適合的刮刮樂！現在就利用這個表格，找尋最高勝率的刮刮樂吧！上市中的刮刮樂主題有${stats
            .map((v) => v.topic)
            .join('、')}`}
        />
        <script type="application/ld+json">
          {`
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "哪裡能買到刮刮樂？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "可以至各大公益彩券的投注站購買"
            }
        },
        {
            "@type": "Question",
            "name": "台灣彩券 APP 可以購買電子版刮刮樂嗎？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "不可以，但是可以使用 APP 掃描紙本刮刮樂上 QRCODE 確認自己是否中獎。"
            }
        },
        {
            "@type": "Question",
            "name": "若刮刮樂中獎，需要繳納所得稅嗎？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "隨著中獎身分的不同，需要繳納不同的稅額"
            }
        },
        {
            "@type": "Question",
            "name": "現在有幾種刮刮樂可以玩？獎金有多少？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "現在熱賣中的刮刮樂有 ${stats.length} 款，總獎金高達新台幣 176 億元。"
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
      "@type": "Article",
      "url": "https://lottery.celestialstudio.net/article/instant-lottery",
      "headline": "刮刮樂機率分析，最容易中獎的是這一個！",
      "description": "最完整的台灣刮刮樂機率分析、勝率、回本率、期望值，每週自動更新。",
      "datePublished": "${new Date().toISOString()}",
      "dateModified": "${new Date().toISOString()}",
      "author": [{
          "@type": "Organization",
          "name": "Celestial Studio"
        }],
      "publisher": {
          "@type": "Organization",
          "name": "Celestial Studio",
          "logo": {
              "@type": "ImageObject",
              "url": "https://lottery.celestialstudio.net/icon.png"
          }
      }
    }
`}
        </script>
      </Head>
      <StatsTable />
    </>
  );
}
