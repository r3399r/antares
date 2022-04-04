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
import style from './Happy49.module.scss';

const Happy49 = () => {
  const all = useMemo(() => combinations(49, 6), []);
  const two = useMemo(() => combinations(47, 4), []);
  const three = useMemo(() => combinations(46, 3), []);
  const four = useMemo(() => combinations(45, 2), []);

  return (
    <>
      <h1>49樂合彩</h1>
      <p>
        49樂合彩按照您所選擇之玩法從 01~49 中任選複數個號碼，二合選 2 碼，三合選 3 碼，四合選 4
        碼，即為投注號碼，49樂合彩開獎號碼依附於大樂透之開獎獎號。
      </p>
      <p>49 選 6 的全部組合數總共有 {all.toLocaleString()} 組。</p>
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
              <TableCell>$1,250</TableCell>
              <TableCell>${((two / all) * 1250).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>三合</TableCell>
              <TableCell>{three.toLocaleString()}</TableCell>
              <TableCell>{((three / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$12,500</TableCell>
              <TableCell>${((three / all) * 12500).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>四合</TableCell>
              <TableCell>{four.toLocaleString()}</TableCell>
              <TableCell>{((four / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$200,000</TableCell>
              <TableCell>${((four / all) * 200000).toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Happy49;
