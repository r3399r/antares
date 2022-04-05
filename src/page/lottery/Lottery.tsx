import { Button, Menu, MenuItem } from '@mui/material';
import { MouseEvent, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { lotteryGames } from 'src/constant/Lottery';
import DailyCash539 from './component/DailyCash539';
import Happy38 from './component/Happy38';
import Happy39 from './component/Happy39';
import Happy49 from './component/Happy49';
import Lotto1224 from './component/Lotto1224';
import Lotto649 from './component/Lotto649';
import Star3 from './component/Star3';
import Star4 from './component/Star4';
import SuperLotto638 from './component/SuperLotto638';
import style from './Lottery.module.scss';

const Lottery = () => {
  const { search } = useLocation();
  const [queryParamIgnored, setQueryParam] = useSearchParams();
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
      {code === 'lotto649' && <Lotto649 />}
      {code === 'dailyCash539' && <DailyCash539 />}
      {code === 'lotto1224' && <Lotto1224 />}
      {code === 'star3' && <Star3 />}
      {code === 'star4' && <Star4 />}
      {code === 'happy38' && <Happy38 />}
      {code === 'happy49' && <Happy49 />}
      {code === 'happy39' && <Happy39 />}
    </>
  );
};

export default Lottery;
