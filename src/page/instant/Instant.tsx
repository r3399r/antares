import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { sum } from 'mathjs';
import { instants } from 'src/constant/Instant';
import style from './Instant.module.scss';

const Instant = () => (
  <>
    {instants.map((v, i) => {
      const prized = sum(v.structure.map((o) => o.howMany)); // 有獎張數
      const backCost = sum(v.structure.map((o) => (o.prize >= v.cost ? o.howMany : 0))); // 回本張數
      const earned = sum(v.structure.map((o) => (o.prize > v.cost ? o.howMany : 0))); // 獲利張數

      return (
        <Accordion key={v.id} TransitionProps={{ unmountOnExit: i > 10 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {v.releaseDate} {v.topic}
          </AccordionSummary>
          <AccordionDetails>
            <div className={style.flex}>
              <div>售價: ${v.cost.toLocaleString()}</div>
              <div>總發行張數: {v.total.toLocaleString()}</div>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>獎金</TableCell>
                      <TableCell>張數</TableCell>
                      <TableCell>機率</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {v.structure.map((o) => (
                      <TableRow key={o.prize}>
                        <TableCell>${o.prize.toLocaleString()}</TableCell>
                        <TableCell>{o.howMany.toLocaleString()}</TableCell>
                        <TableCell>{((o.howMany / v.total) * 100).toFixed(5)}%</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>$0</TableCell>
                      <TableCell>{(v.total - prized).toLocaleString()}</TableCell>
                      <TableCell>{(100 - (prized / v.total) * 100).toFixed(5)}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <div>
                期望值: $
                {sum(v.structure.map((o) => (o.prize * o.howMany) / v.total)).toLocaleString()}
              </div>
              <div>總中獎率: {((prized / v.total) * 100).toFixed(5)}%</div>
              <div>回本機率: {((backCost / v.total) * 100).toFixed(5)}%</div>
              <div>賺錢機率: {((earned / v.total) * 100).toFixed(5)}%</div>
            </div>
          </AccordionDetails>
        </Accordion>
      );
    })}
  </>
);

export default Instant;
