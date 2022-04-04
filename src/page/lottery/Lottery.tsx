import { Button, Menu, MenuItem } from '@mui/material';
import { MouseEvent, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { lotteryGames } from 'src/constant/Lottery';
import SuperLotto638 from './component/SuperLotto638';
import style from './Lottery.module.scss';

const Lottery = () => {
  const { search } = useLocation();
  const [_queryParam, setQueryParam] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [code, setCode] = useState<string>(lotteryGames[0].code);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const g = new URLSearchParams(search).get('g');
    if (g !== null && lotteryGames.map((v) => v.code).includes(g)) setCode(g);
  }, [search]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleItemClick = (v: string) => () => {
    setQueryParam({ g: v });
    handleClose();
  };

  return (
    <>
      <div className={style.margin}>
        <Button variant="outlined" onClick={handleClick}>
          遊戲玩法
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {lotteryGames.map((v) => (
            <MenuItem key={v.code} onClick={handleItemClick(v.code)}>
              {v.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
      {code === 'superLotte638' && <SuperLotto638 />}
    </>
  );
};

export default Lottery;
