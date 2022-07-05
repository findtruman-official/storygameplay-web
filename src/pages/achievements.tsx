import type React from 'react';
import { useWallet, useWalletAgent } from '@/providers/WalletProvider';
import { AchievementCard } from '@/components/Achievement';
import styles from './achievements.less';
import { Col, Row } from 'antd';
import { NumberCard } from '@/components/Tokens';
import { useRequest } from 'ahooks';
import { listBadgeStatus } from '@/services/api';
import { useERC20Balance } from '@/hooks/web3/useERC20Balance';
import { FTT_ADDRESS } from '@/consts';
import { readableTokens } from '@/utils';
import { ThemeButton } from '@/components/Button';
import { globalEvent } from '@/utils/events';
const AchievementPage: React.FC<{}> = (props) => {
  const { account } = useWallet();

  const badgeReq = useRequest(
    () =>
      listBadgeStatus({
        address: account || '0x0000000000000000000000000000000000000000',
        scenes: Scenes,
      }),
    {
      refreshDeps: [account],
    },
  );

  const tokenBalance = useERC20Balance(FTT_ADDRESS, account);

  const badges = badgeReq.data || LoadingScenes;

  return (
    <div className={styles.page}>
      <Title loading={tokenBalance.loading}>Polygon!</Title>
      <Title loading={tokenBalance.loading}>My Tokens</Title>

      {account ? (
        <Row justify="center">
          <Col>
            <NumberCard number={readableTokens(tokenBalance.data || '0')} />
          </Col>
        </Row>
      ) : (
        <ThemeButton
          style={{ display: 'block', margin: '0 auto' }}
          onClick={() => globalEvent.openConnectWalletModal()}
        >
          Connect Wallet
        </ThemeButton>
      )}

      <Title loading={badgeReq.loading}> My Achievements </Title>

      <Row gutter={[32, 32]}>
        {badges.map((a) => (
          <Col key={a.scene} span={12}>
            <AchievementCard
              style={{ width: '100%' }}
              scene={a.scene}
              name={a.name}
              image={a.image}
              desc={a.description}
              got={a.claimable}
              tokens={a.tokens}
              badgeId={a.badgeId}
              achievementProofs={a.achievementProofs}
              tokensProofs={a.tokensProofs}
              onStatusChanged={tokenBalance.run}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

const Title: React.FC<{ children?: React.ReactNode; loading?: boolean }> = (
  props,
) => {
  return (
    <h2 className={styles.title}>
      {props.children}
      {props.loading && <div>Loading...</div>}
    </h2>
  );
};

const Scenes = [
  'black-water-lake',
  'scarlet-church',
  'metaverse-carnival',
  'beelzebub',
  'scene05',
  'scene06',
];

const LoadingScenes = Scenes.map((scene) => ({
  scene: scene,
  name: 'Loading',
  image: 'https://findtruman.io/favicon.png',
  description: 'The exciting scene is coming soon, please be patient',
  claimable: false,
  tokens: 200,
  badgeId: null,
  achievementProofs: [],
  tokensProofs: [],
}));

export default AchievementPage;
