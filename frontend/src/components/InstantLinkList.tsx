import Link from 'next/link';
import { InstantLink } from '@/model/Instant';
import { bn } from '@/util/bignumber';
import { instantPath } from '@/constant/site';

type Props = { items: InstantLink[]; showClosedAt?: boolean };

/** Internal links to other cards, so every page is reachable by a crawler. */
const InstantLinkList = ({ items, showClosedAt = false }: Props) => (
  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
    {items.map((v) => (
      <li key={v.id}>
        <Link href={instantPath(v.id)} className="text-weissbier underline">
          {v.topic}（${v.price}）
        </Link>
        <span className="ml-2 text-sm">
          {showClosedAt
            ? `${v.closedAt} 下市`
            : `中獎率 ${bn(v.bingoRate).toFixed(1)}%・期望值 $${bn(v.expect).toFixed(1)}`}
        </span>
      </li>
    ))}
  </ul>
);

export default InstantLinkList;
