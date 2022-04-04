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
import style from './DailyCash539.module.scss';

const DailyCash539 = () => {
  const all = useMemo(() => combinations(39, 5), []);
  const first = useMemo(() => 1, []);
  const second = useMemo(() => combinations(5, 4) * combinations(34, 1), []);
  const third = useMemo(() => combinations(5, 3) * combinations(34, 2), []);
  const fourth = useMemo(() => combinations(5, 2) * 1 * combinations(34, 3), []);
  const fail = useMemo(() => all - first - second - third - fourth, []);

  return (
    <>
      <h1>今彩539</h1>
      <p>今彩539的玩法是從 01~39 中任選 5 個號碼進行投注，開獎時會開出 5 個號碼，即為中獎號碼。</p>
      <p>39 選 5 的全部組合數總共有 {all.toLocaleString()} 組。</p>
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
              <TableCell>5 碼</TableCell>
              <TableCell>頭獎</TableCell>
              <TableCell>{first.toLocaleString()}</TableCell>
              <TableCell>{((first / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$8,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4 碼</TableCell>
              <TableCell>貳獎</TableCell>
              <TableCell>{second.toLocaleString()}</TableCell>
              <TableCell>{((second / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$20,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3 碼</TableCell>
              <TableCell>參獎</TableCell>
              <TableCell>{third.toLocaleString()}</TableCell>
              <TableCell>{((third / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$300</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2 碼</TableCell>
              <TableCell>肆獎</TableCell>
              <TableCell>{fourth.toLocaleString()}</TableCell>
              <TableCell>{((fourth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$50</TableCell>
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
        {((first * 8000000 + second * 20000 + third * 300 + fourth * 50) / all).toLocaleString()}
      </p>
    </>
  );
};

export default DailyCash539;
