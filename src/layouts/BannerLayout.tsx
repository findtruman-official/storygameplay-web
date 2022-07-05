import { TextButton } from '@/components/Button';
import { ConnectWalletModal } from '@/components/Wallet';
import { useWallet } from '@/providers/WalletProvider';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'umi';
import styles from './BannerLayout.less';
import { globalEvent, GlobalEventType } from '@/utils/events';
import { useLocation } from '@@/exports';

export default function Layout() {
  const [vis, setVis] = useState(false);
  const { connected, account } = useWallet();

  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    globalEvent.addEventListener(GlobalEventType.OpenConnectWalletModal, () => {
      setVis(true);
    });
  }, []);

  return (
    <>
      {connected && (
        <Row justify="end" className={styles.banner}>
          <Col>
            <TextButton onClick={() => setVis(true)}>{account}</TextButton>
          </Col>
        </Row>
      )}

      <div className={styles.menu}>
        <a href={'#/'}>
          <div
            className={
              pathname === '/' ? styles.menuItemActive : styles.menuItem
            }
          >
            Home
          </div>
        </a>
        <div>/</div>
        <a href={'#/achievements'}>
          <div
            className={
              pathname === '/achievements'
                ? styles.menuItemActive
                : styles.menuItem
            }
          >
            Achievements
          </div>
        </a>
      </div>

      <Outlet />

      <ConnectWalletModal visible={vis} onClose={() => setVis(false)} />
    </>
  );
}
