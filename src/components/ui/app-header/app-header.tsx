import { FC } from 'react';
import clsx from 'clsx';
import { Link, NavLink, useMatch } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const isIngredientRoute = Boolean(useMatch('/ingredients/:id'));

  return (
    <header className={styles.header}>
      <nav className={clsx(styles.menu, 'p-4')}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            end
            className={({ isActive }) =>
              clsx(styles.link, {
                [styles.link_active]: isActive || isIngredientRoute
              })
            }
          >
            {({ isActive }) => {
              const isConstructorActive = isActive || isIngredientRoute;

              return (
                <>
                  <BurgerIcon
                    type={isConstructorActive ? 'primary' : 'secondary'}
                  />
                  <p className='text text_type_main-default ml-2 mr-10'>
                    {
                      '\u041A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440'
                    }
                  </p>
                </>
              );
            }}
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              clsx(styles.link, {
                [styles.link_active]: isActive
              })
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2'>
                  {
                    '\u041B\u0435\u043D\u0442\u0430 \u0437\u0430\u043A\u0430\u0437\u043E\u0432'
                  }
                </p>
              </>
            )}
          </NavLink>
        </div>
        <Link to='/' className={styles.logo}>
          <Logo className='' />
        </Link>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            clsx(styles.link, styles.link_position_last, {
              [styles.link_active]: isActive
            })
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>
                {userName ||
                  '\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442'}
              </p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
