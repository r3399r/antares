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
import style from './SuperLotto638.module.scss';

const SuperLotto638 = () => {
  const all = useMemo(() => combinations(38, 6) * 8, []);
  const first = useMemo(() => 1 * 1, []);
  const second = useMemo(() => 1 * 7, []);
  const third = useMemo(() => combinations(6, 5) * combinations(32, 1) * 1, []);
  const fourth = useMemo(() => combinations(6, 5) * combinations(32, 1) * 7, []);
  const fifth = useMemo(() => combinations(6, 4) * combinations(32, 2) * 1, []);
  const sixth = useMemo(() => combinations(6, 4) * combinations(32, 2) * 7, []);
  const seventh = useMemo(() => combinations(6, 3) * combinations(32, 3) * 1, []);
  const eighth = useMemo(() => combinations(6, 2) * combinations(32, 4) * 1, []);
  const nineth = useMemo(() => combinations(6, 3) * combinations(32, 3) * 7, []);
  const normal = useMemo(() => combinations(6, 1) * combinations(32, 5) * 1, []);
  const fail = useMemo(
    () =>
      all - first - second - third - fourth - fifth - sixth - seventh - eighth - nineth - normal,
    [],
  );

  return (
    <>
      <h1>威力彩</h1>
      <p>
        威力彩的玩法是從第一選區的 01~38 中任選 6 個號碼，並從第二選區的 01~08 中選 1
        個號碼，即為投注號碼，開獎時會在第一區開出 6 個號碼，再從第二區開出 1 個號碼，即為中獎號碼。
      </p>
      <p>
        總投注金額乘以 55%
        加上前一期累積獎金即為當期總獎金。頭獎及貳獎由總獎金扣除固定獎金獎項總額之餘額，再依分配比率進行分配。若頭獎獎金之分配獎金未達
        2 億元，則獎金以 2 億元計算。頭獎及貳獎若無人獲得該獎項，則累積納入次期該獎項。
      </p>
      <p>第一區 38 選 6 且第二區 8 選 1 的全部組合數總共有 {all.toLocaleString()} 組。</p>
      <TableContainer component={Paper} className={style.table}>
        <Table>
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
              <TableCell>第一區 6 個&第二區</TableCell>
              <TableCell>頭獎</TableCell>
              <TableCell>{first.toLocaleString()}</TableCell>
              <TableCell>{((first / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>89%；至少 2 億</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第一區 6 個</TableCell>
              <TableCell>貳獎</TableCell>
              <TableCell>{second.toLocaleString()}</TableCell>
              <TableCell>{((second / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>11%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第一區 5 個&第二區</TableCell>
              <TableCell>參獎</TableCell>
              <TableCell>{third.toLocaleString()}</TableCell>
              <TableCell>{((third / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$150,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第一區 5 個</TableCell>
              <TableCell>肆獎</TableCell>
              <TableCell>{fourth.toLocaleString()}</TableCell>
              <TableCell>{((fourth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$20,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第一區 4 個&第二區</TableCell>
              <TableCell>伍獎</TableCell>
              <TableCell>{fifth.toLocaleString()}</TableCell>
              <TableCell>{((fifth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$4,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第一區 4 個</TableCell>
              <TableCell>陸獎</TableCell>
              <TableCell>{sixth.toLocaleString()}</TableCell>
              <TableCell>{((sixth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$800</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第一區 3 個&第二區</TableCell>
              <TableCell>柒獎</TableCell>
              <TableCell>{seventh.toLocaleString()}</TableCell>
              <TableCell>{((seventh / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$400</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第一區 2 個&第二區</TableCell>
              <TableCell>捌獎</TableCell>
              <TableCell>{eighth.toLocaleString()}</TableCell>
              <TableCell>{((eighth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$200</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第一區 3 個</TableCell>
              <TableCell>玖獎</TableCell>
              <TableCell>{nineth.toLocaleString()}</TableCell>
              <TableCell>{((nineth / all) * 100).toFixed(6)}%</TableCell>
              <TableCell>$100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>第一區 1 個&第二區</TableCell>
              <TableCell>普獎</TableCell>
              <TableCell>{normal.toLocaleString()}</TableCell>
              <TableCell>{((normal / all) * 100).toFixed(6)}%</TableCell>
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
    </>
  );
};

export default SuperLotto638;
