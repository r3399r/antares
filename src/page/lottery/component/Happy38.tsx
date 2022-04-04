import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { combinations } from 'mathjs';
import { useMemo } from 'react';
import style from './Happy38.module.scss';

const Happy38 = () => {
  const all = useMemo(() => combinations(38, 6), []);
  const two = useMemo(() => combinations(36, 4), []);
  const three = useMemo(() => combinations(35, 3), []);
  const four = useMemo(() => combinations(34, 2), []);
  const five = useMemo(() => combinations(33, 1), []);

  return (
    <>
      <h1>38樂合彩</h1>
      <p>
        38樂合彩按照您所選擇之玩法從 01~38 中任選複數個號碼，二合選 2 碼，三合選 3 碼，四合選 4
        碼，五合選 5 碼，即為投注號碼，38樂合彩開獎號碼依附於威力彩第一區之開獎獎號。
      </p>
      <p>38 選 6 的全部組合數總共有 {all.toLocaleString()} 組。</p>
      <TableContainer component={Paper}>
        <Table className={style.table}>
          <TableHead>
            <TableRow>
              <TableCell>玩法</TableCell>
              <TableCell>中獎組合</TableCell>
              <TableCell>機率</TableCell>
              <TableCell>獎金</TableCell>
              <TableCell>期望值</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>二合</TableCell>
              <TableCell>{two.toLocaleString()}</TableCell>
              <TableCell>{((two / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$750</TableCell>
              <TableCell>${((two / all) * 750).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>三合</TableCell>
              <TableCell>{three.toLocaleString()}</TableCell>
              <TableCell>{((three / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$5,750</TableCell>
              <TableCell>${((three / all) * 5750).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>四合</TableCell>
              <TableCell>{four.toLocaleString()}</TableCell>
              <TableCell>{((four / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$67,500</TableCell>
              <TableCell>${((four / all) * 67500).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>五合</TableCell>
              <TableCell>{five.toLocaleString()}</TableCell>
              <TableCell>{((five / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$1,150,000</TableCell>
              <TableCell>${((five / all) * 1150000).toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Happy38;
