import {
  Icon28UserCircleOutline,
  Icon28NewsfeedOutline,
  Icon28SettingsOutline,
} from '@vkontakte/icons';
import { Tabbar, TabbarItem } from '@vkontakte/vkui';
import { useLocation, useNavigate } from 'react-router-dom';

type Tab = 'profile' | 'weeks' | 'settings';

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const active: Tab = pathname.startsWith('/weeks')
    ? 'weeks'
    : pathname.startsWith('/settings')
      ? 'settings'
      : 'profile';

  return (
    <Tabbar>
      <TabbarItem
        selected={active === 'profile'}
        onClick={() => navigate('/profile')}
        label="Профиль"
      >
        <Icon28UserCircleOutline />
      </TabbarItem>
      <TabbarItem selected={active === 'weeks'} onClick={() => navigate('/weeks')} label="Недели">
        <Icon28NewsfeedOutline />
      </TabbarItem>
      <TabbarItem
        selected={active === 'settings'}
        onClick={() => navigate('/settings')}
        label="Настройки"
      >
        <Icon28SettingsOutline />
      </TabbarItem>
    </Tabbar>
  );
}
