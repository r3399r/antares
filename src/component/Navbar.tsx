import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import style from './Navbar.module.scss';

const Navbar = () => {
  const navigate = useNavigate();

  const goto = (path: Page) => () => {
    navigate(path);
  };

  return (
    <div className={style.self}>
      <div onClick={goto(Page.Landing)}>首頁</div>
      <div onClick={goto(Page.Lottery)}>樂透</div>
      <div onClick={goto(Page.Instant)}>刮刮樂</div>
    </div>
  );
};

export default Navbar;
