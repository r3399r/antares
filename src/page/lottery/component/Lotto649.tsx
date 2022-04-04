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
import style from './Lotto649.module.scss';

const Lotto649 = () => {
  const all = useMemo(() => combinations(49, 6), []);
  const first = useMemo(() => 1, []);
  const second = useMemo(() => combinations(6, 5) * 1, []);
  const third = useMemo(() => combinations(6, 5) * combinations(42, 1), []);
  const fourth = useMemo(() => combinations(6, 4) * 1 * combinations(42, 1), []);
  const fifth = useMemo(() => combinations(6, 4) * combinations(42, 2), []);
  const sixth = useMemo(() => combinations(6, 3) * 1 * combinations(42, 2), []);
  const seventh = useMemo(() => combinations(6, 3) * combinations(42, 3), []);
  const normal = useMemo(() => combinations(6, 2) * 1 * combinations(42, 3), []);
  const fail = useMemo(
    () => all - first - second - third - fourth - fifth - sixth - seventh - normal,
    [],
  );

  return (
    <>
      <h1>大樂透</h1>
      <p>
        大樂透的玩法是從 01~49 中任選 6 個號碼進行投注，開獎時會開出 6 個號碼加 1
        個特別號，即為中獎號碼。
      </p>
      <p>
        總投注金額乘以 56%
        加上前一期累積獎金即為當期總獎金。頭獎至肆獎由總獎金扣除固定獎金獎項總額之餘額，再依分配比率進行分配。若頭獎獎金之分配獎金未達
        1 億元，則獎金以 1 億元計算。頭獎至肆獎若無人獲得該獎項，則累積納入次期該獎項。
      </p>
      <p>49 選 6 的全部組合數總共有 {all.toLocaleString()} 組。</p>
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
              <TableCell>6 碼</TableCell>
              <TableCell>頭獎</TableCell>
              <TableCell>{first.toLocaleString()}</TableCell>
              <TableCell>{((first / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>82%；至少 1 億</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5 碼&特別號</TableCell>
              <TableCell>貳獎</TableCell>
              <TableCell>{second.toLocaleString()}</TableCell>
              <TableCell>{((second / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>6.5%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5 碼</TableCell>
              <TableCell>參獎</TableCell>
              <TableCell>{third.toLocaleString()}</TableCell>
              <TableCell>{((third / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>7%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4 碼&特別號</TableCell>
              <TableCell>肆獎</TableCell>
              <TableCell>{fourth.toLocaleString()}</TableCell>
              <TableCell>{((fourth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>4.5%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4 碼</TableCell>
              <TableCell>伍獎</TableCell>
              <TableCell>{fifth.toLocaleString()}</TableCell>
              <TableCell>{((fifth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$2,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3 碼&特別號</TableCell>
              <TableCell>陸獎</TableCell>
              <TableCell>{sixth.toLocaleString()}</TableCell>
              <TableCell>{((sixth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$1,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2 碼&特別號</TableCell>
              <TableCell>柒獎</TableCell>
              <TableCell>{seventh.toLocaleString()}</TableCell>
              <TableCell>{((seventh / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$400</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3 碼</TableCell>
              <TableCell>普獎</TableCell>
              <TableCell>{normal.toLocaleString()}</TableCell>
              <TableCell>{((normal / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$400</TableCell>
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
    </>
  );
};

export default Lotto649;
