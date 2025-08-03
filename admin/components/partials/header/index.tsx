import HeaderContent from './header-content';
import HeaderLogo from './header-logo';
import LocalSwitcher from './locale-switcher';
import ProfileInfo from './profile-info';
import ThemeSwitcher from './theme-switcher';

import { SheetMenu } from '@/components/partials/sidebar/menu/sheet-menu';
import { SidebarToggle } from '@/components/partials/sidebar/sidebar-toggle';

const DashCodeHeader = async () => {
  return (
    <>
      <HeaderContent>
        <div className=" flex gap-3 items-center">
          <HeaderLogo />
          <SidebarToggle />
          {/* <HeaderSearch /> */}
        </div>
        <div className="nav-tools flex items-center  md:gap-4 gap-3">
          <LocalSwitcher />
          <ThemeSwitcher />
          {/* <Cart /> */}
          {/* <Messages /> */}
          {/* <Notifications /> */}
          <ProfileInfo />
          <SheetMenu />
        </div>
      </HeaderContent>
    </>
  );
};

export default DashCodeHeader;
