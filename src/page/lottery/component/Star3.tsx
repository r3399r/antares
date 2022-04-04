import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import style from './Star3.module.scss';

const Star3 = () => (
  <>
    <h1>3星彩</h1>
    <p>
      3星彩的玩法是從 000~999 中選出一組三位數，並選擇玩法進行投注，開獎時會開出一組 3
      位數號碼，即為中獎號碼。
    </p>
    <p>
      玩法可分為正彩、組彩及對彩，正彩是「對數字，也要對位置」；組彩是「只對數字，不用對位置」；對彩：
      是「對前二個或後二個數字，也要對位置」。
    </p>
    <p>000~999 的全部選擇總共有 1,000 種。</p>
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
            <TableCell>正彩</TableCell>
            <TableCell>1</TableCell>
            <TableCell>0.1%</TableCell>
            <TableCell>$12,500</TableCell>
            <TableCell>$12.5</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3組彩</TableCell>
            <TableCell>3</TableCell>
            <TableCell>0.3%</TableCell>
            <TableCell>$4,000</TableCell>
            <TableCell>$12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>6組彩</TableCell>
            <TableCell>6</TableCell>
            <TableCell>0.6%</TableCell>
            <TableCell>$2,000</TableCell>
            <TableCell>$12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>對彩</TableCell>
            <TableCell>20</TableCell>
            <TableCell>2.0%</TableCell>
            <TableCell>$750</TableCell>
            <TableCell>$15</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default Star3;
