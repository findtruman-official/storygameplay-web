import React, { useState } from 'react';
import { Col, Modal, Row, Alert, Button, Spin, message } from 'antd';
import {
  LogoutOutlined,
  CopyOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import MetaMaskIcon from '@/assets/icons/metamask.svg';
import styles from './ConnectWalletModal.less';
import { useWallet } from '@/providers/WalletProvider';
import { copy } from '@/utils';
import { BorderOnHover } from '../Colorful';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const WalletIcon: { [type in WalletType]: React.ReactNode } = {
  metamask: <img src={MetaMaskIcon} className={styles.walletLogo} />,
  none: <></>,
};

const WalletIconCardStyle: React.CSSProperties = {
  padding: 16,
  background: '#1b2a2d',
  width: 120,
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const ConnectWalletModal: React.FC<Props> = ({ visible, onClose }) => {
  const { connected, account, connect, disconnect, wallet } = useWallet();

  const [connecting, setConnecting] = useState<boolean>(false);
  return (
    <Modal
      onCancel={() => {
        !connecting && onClose();
      }}
      visible={visible}
      closable={false}
      footer={false}
      width={600}
      centered={true}
      bodyStyle={{
        padding: 48,
        position: 'relative',
      }}
    >
      {connected ? (
        <>
          <div
            style={{
              display: 'flex',
              // flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              columnGap: 24,
            }}
          >
            {WalletIcon[wallet]}
            <div>
              <div className={styles.walletName} style={{ fontSize: 18 }}>
                {wallet}
              </div>
              <div className={styles.clickTip}>
                {/* <Badge
                  style={{ width: 8, height: 8, marginRight: 8 }}
                  color={ChainColor[chainId] || '#d7d9dc'}
                />
                {ChainName[initialState.chainId] || 'Unknown'} */}
              </div>
            </div>
          </div>
          <Alert
            type={'info'}
            message={<div className={styles.addressTitle}>Wallet Address</div>}
            description={
              <div>
                {account}
                <CopyOutlined
                  onClick={() =>
                    copy(account).then(() => message.success('Copied'))
                  }
                  className={styles.copyBtn}
                />
              </div>
            }
          />
          <Button
            style={{ position: 'absolute', right: 48, top: 48 }}
            onClick={disconnect}
            icon={<LogoutOutlined />}
            size={'large'}
            type="text"
          />
        </>
      ) : (
        <Spin
          spinning={connecting}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          tip="Connecting"
        >
          <div>
            <div className={styles.title}>Connect Wallet</div>
            <Row justify={'center'} gutter={36}>
              <Col>
                <div
                  className={styles.walletCol}
                  onClick={async () => {
                    setConnecting(true);
                    await connect({ wallet: 'metamask' });
                    setConnecting(false);
                  }}
                >
                  <BorderOnHover
                    borderRadius={'0px'}
                    style={{ width: '100%', height: '100%' }}
                    contentStyle={WalletIconCardStyle}
                  >
                    {WalletIcon.metamask}
                  </BorderOnHover>
                  <div className={styles.walletClickable}>
                    <div className={styles.walletName}>MetaMask</div>
                    <div className={styles.clickTip}>
                      Click to connect wallet
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      )}
    </Modal>
  );
};
