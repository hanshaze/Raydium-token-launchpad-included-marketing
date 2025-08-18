import * as React from "react";
import { Link, useLocation } from 'react-router-dom';
import WalletButton from '../providers/WalletButton';
import {
  IconButton,
  Typography,
  Collapse,
} from "@material-tailwind/react";
import { FaXmark } from "react-icons/fa6";
import { MdMenu } from "react-icons/md";

const navLinks = [
  { name: 'Create Token', path: '/' },
  { name: 'Create Liquidity', path: '/create-liquidity' },
  { name: 'Manage Liquidity', path: '/manage-liquidity' },
  { name: 'Marketing', path: '/marketing' },
  { name: 'Affiliate', path: '/affiliate' },
];

function NavList({ onLinkClick }) {
  const location = useLocation();
  
  return (
    <ul className="flex flex-col mt-4 gap-y-2 lg:mt-0 lg:flex-row lg:items-center lg:gap-x-8">
      {navLinks.map(({ name, path }) => (
        <li key={path}>
          <Typography
            as={Link}
            to={path}
            onClick={onLinkClick}
            className={`font-medium transition-colors duration-200 text-14 ${
              location.pathname === path || location.pathname.startsWith(path + "/") 
                ? 'text-primary' 
                : 'text-white hover:text-primary'
            }`}
          >
            {name}
          </Typography>
        </li>
      ))}
    </ul>
  );
}

const Header = () => {
  const [openNav, setOpenNav] = React.useState(false);

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.mobile-nav');
      if (nav && !nav.contains(event.target) && !event.target.closest('.menu-button')) {
        setOpenNav(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary">
      <div className="container max-w-[1280px] px-4 mx-auto">
        <div className="flex items-center justify-between h-[70px]">
          <Link to="/" className="flex items-center">
            <div className="font-bold text-white text-18">Raydium<span className="text-primary">Launch</span></div>
          </Link>

          <div className="hidden lg:block">
            <NavList />
          </div>

          <div className="flex items-center gap-4">
            <WalletButton />
            <IconButton
              size="sm"
              className="lg:hidden menu-button bg-primary hover:bg-primary/90"
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <FaXmark className="w-4 h-4 text-white" />
              ) : (
                <MdMenu className="w-4 h-4 text-white" />
              )}
            </IconButton>
          </div>
        </div>
      </div>

      <Collapse open={openNav} className="lg:hidden mobile-nav">
        <div className="container px-4 pb-4 mx-auto">
          <NavList onLinkClick={handleCloseNav} />
        </div>
      </Collapse>
    </header>
  );
};

export default Header;
