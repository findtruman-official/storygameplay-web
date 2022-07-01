import { TextButton } from '@/components/Button';
import { ConnectWalletModal } from '@/components/Wallet';
import { useWallet } from '@/providers/WalletProvider';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet } from 'umi';
import styles from './BannerLayout.less';

export default function Layout() {
  const [vis, setVis] = useState(false);
  const { connected, account } = useWallet();

  return (
    <>
      <Row justify="end" className={styles.banner}>
        <Col>
          <TextButton onClick={() => setVis(true)}>
            {connected ? account : 'Connect Wallet'}
          </TextButton>
        </Col>
      </Row>

      <Outlet />

      <ConnectWalletModal visible={vis} onClose={() => setVis(false)} />
    </>
  );
}
