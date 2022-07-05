import { TextButton } from '@/components/Button';
import { ConnectWalletModal } from '@/components/Wallet';
import { useWallet } from '@/providers/WalletProvider';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet } from 'umi';
import styles from './BannerLayout.less';
import { globalEvent, GlobalEventType } from '@/utils/events';

export default function Layout() {
  const [vis, setVis] = useState(false);
  const { connected, account } = useWallet();

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

      <Outlet />

      <ConnectWalletModal visible={vis} onClose={() => setVis(false)} />
    </>
  );
}
