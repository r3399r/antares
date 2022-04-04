import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import style from './Star4.module.scss';

const Star4 = () => (
  <>
    <h1>4星彩</h1>
    <p>
      4星彩的玩法是從 0000~9999 中選出一組四位數，並選擇玩法進行投注，開獎時會開出一組 4
      位數號碼，即為中獎號碼。
    </p>
    <p>玩法可分為正彩及組彩，正彩是「對數字，也要對位置」；組彩是「只對數字，不用對位置」。</p>
    <p>0000~9999 的全部選擇總共有 10,000 種。</p>
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
            <TableCell>0.01%</TableCell>
            <TableCell>$125,000</TableCell>
            <TableCell>$12.5</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>4組彩</TableCell>
            <TableCell>4</TableCell>
            <TableCell>0.04%</TableCell>
            <TableCell>$30,000</TableCell>
            <TableCell>$12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>6組彩</TableCell>
            <TableCell>6</TableCell>
            <TableCell>0.06%</TableCell>
            <TableCell>$20,000</TableCell>
            <TableCell>$12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>12組彩</TableCell>
            <TableCell>12</TableCell>
            <TableCell>0.12%</TableCell>
            <TableCell>$10,000</TableCell>
            <TableCell>$12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>24組彩</TableCell>
            <TableCell>24</TableCell>
            <TableCell>0.24%</TableCell>
            <TableCell>$5,000</TableCell>
            <TableCell>$12</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default Star4;
