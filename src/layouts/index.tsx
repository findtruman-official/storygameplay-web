import { TextButton } from '@/components/Button';
import { ConnectWalletModal } from '@/components/Wallet';
import WalletProvider, { useWallet } from '@/providers/WalletProvider';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'umi';
import styles from './index.less';
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
    <WalletProvider>
      {connected && (
        <Row justify="end" className={styles.banner}>
          <Col>
            <TextButton onClick={() => setVis(true)}>{account}</TextButton>
          </Col>
        </Row>
      )}

      <div className={styles.menuContainer}>
        <div className={styles.menu}>
          <a
            href={'#/'}
            className={
              pathname === '/' ? styles.menuItemActive : styles.menuItem
            }
          >
            Story-Gameplay
          </a>
          <div>/</div>
          <a
            href={'https://findtruman.io/story-release/'}
            className={styles.menuItem}
            target={'_blank'}
          >
            UGC Editor
          </a>
          <div>/</div>
          <a
            href={'#/achievements'}
            className={
              pathname === '/achievements'
                ? styles.menuItemActive
                : styles.menuItem
            }
          >
            Achievements
          </a>
        </div>
      </div>

      <Outlet />

      <ConnectWalletModal visible={vis} onClose={() => setVis(false)} />
    </WalletProvider>
  );
}
