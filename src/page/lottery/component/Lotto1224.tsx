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
import style from './Lotto1224.module.scss';

const Lotto1224 = () => {
  const all = useMemo(() => combinations(24, 12), []);
  const first = useMemo(() => 2, []);
  const second = useMemo(() => combinations(12, 11) * combinations(12, 1) * 2, []);
  const third = useMemo(() => combinations(12, 10) * combinations(12, 2) * 2, []);
  const fourth = useMemo(() => combinations(12, 9) * combinations(12, 3) * 2, []);
  const fail = useMemo(() => all - first - second - third - fourth, []);

  return (
    <>
      <h1>雙贏彩</h1>
      <p>雙贏彩的玩法是從 01~24 中任選 12 個號碼進行投注，開獎時會開出 12 個號碼，即為中獎號碼。</p>
      <p>24 選 12 的全部組合數總共有 {all.toLocaleString()} 組。</p>
      <TableContainer component={Paper}>
        <Table className={style.table}>
          <TableHead>
            <TableRow>
              <TableCell>中獎方式</TableCell>
              <TableCell>獎項</TableCell>
              <TableCell>組合數</TableCell>
              <TableCell>機率</TableCell>
              <TableCell>獎金分配</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>12 碼或 0 碼</TableCell>
              <TableCell>頭獎</TableCell>
              <TableCell>{first.toLocaleString()}</TableCell>
              <TableCell>{((first / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$15,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>11 碼或 1 碼</TableCell>
              <TableCell>貳獎</TableCell>
              <TableCell>{second.toLocaleString()}</TableCell>
              <TableCell>{((second / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$100,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>10 碼或 2 碼</TableCell>
              <TableCell>參獎</TableCell>
              <TableCell>{third.toLocaleString()}</TableCell>
              <TableCell>{((third / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$500</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>9 碼或 3 碼</TableCell>
              <TableCell>肆獎</TableCell>
              <TableCell>{fourth.toLocaleString()}</TableCell>
              <TableCell>{((fourth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>無獎</TableCell>
              <TableCell>{fail.toLocaleString()}</TableCell>
              <TableCell>{((fail / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$0</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <p>
        期望值: $
        {((first * 15000000 + second * 100000 + third * 500 + fourth * 100) / all).toLocaleString()}
      </p>
    </>
  );
};

export default Lotto1224;
