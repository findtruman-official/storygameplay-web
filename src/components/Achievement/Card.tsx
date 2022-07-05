import { FTC_ADDRESS } from '@/consts';
import {
  useFTCCanClaimBadge,
  useFTCCanClaimTokens,
  useFTCClaimBadge,
  useFTCClaimTokens,
} from '@/hooks/web3';
import { useWallet } from '@/providers/WalletProvider';
import type React from 'react';
import { DisabledThemeButton, ThemeButton } from '../Button';
import { BorderOnHover } from '../Colorful';
import styles from './Card.less';
import { globalEvent } from '@/utils/events';

export const AchievementCard: React.FC<{
  scene: string;
  name: string;
  image: string;
  got: boolean;
  tokens: number;
  badgeId: number | null;
  desc: string;

  achievementProofs: string[];
  tokensProofs: string[];

  onStatusChanged: () => any;
  style?: React.CSSProperties;
}> = (props) => {
  // 1. claimable && proofs valid && proofs not used  => claimable
  // 2. claimable && proofs not valid => claimable soon
  // 3. claimable && proofs valid && proofs used => claimed
  // 4. !claimable => Not Eligible

  const { account } = useWallet();

  const badge = useFTCCanClaimBadge(
    FTC_ADDRESS,
    account,
    props.badgeId || 0,
    props.achievementProofs,
  );
  const tokens = useFTCCanClaimTokens(
    FTC_ADDRESS,
    account,
    props.badgeId || 0,
    props.tokens,
    props.tokensProofs,
  );
  let badgeStatus: Status = status(props.got, badge.data || 'unclaimable');

  let tokensStatus: Status = status(props.got, tokens.data || 'unclaimable');

  const claimBadge = useFTCClaimBadge(
    FTC_ADDRESS,
    account,
    props.badgeId || 0,
    props.achievementProofs,
  );

  const claimToken = useFTCClaimTokens(
    FTC_ADDRESS,
    account,
    props.badgeId || 0,
    props.tokens || 0,
    props.tokensProofs,
  );

  const loading = badge.loading || tokens.loading;

  const renderButtons = () => {
    if (!account) {
      return (
        <ThemeButton onClick={() => globalEvent.openConnectWalletModal()}>
          <Text>Connect Wallet</Text>
        </ThemeButton>
      );
    } else if (
      badgeStatus === 'not-eligible' ||
      tokensStatus === 'not-eligible'
    ) {
      return (
        <DisabledThemeButton>
          <Text>Not Eligible</Text>
        </DisabledThemeButton>
      );
    } else if (
      badgeStatus === 'claimable soon' ||
      tokensStatus === 'claimable soon'
    ) {
      return (
        <ThemeButton>
          <Text>Claimable soon</Text>
        </ThemeButton>
      );
    } else {
      return (
        <>
          {badgeStatus === 'claimable' && (
            <ThemeButton
              loading={claimBadge.loading}
              onClick={async () => {
                await claimBadge.runAsync();
                await badge.runAsync();
                props.onStatusChanged();
              }}
            >
              <Text>Claim Badge</Text>
            </ThemeButton>
          )}
          {badgeStatus === 'claimed' && (
            <DisabledThemeButton>
              <Text>Badge Claimed</Text>
            </DisabledThemeButton>
          )}

          {tokensStatus === 'claimable' && (
            <ThemeButton
              loading={claimToken.loading}
              onClick={async () => {
                await claimToken.runAsync();
                await tokens.runAsync();
                props.onStatusChanged();
              }}
            >
              <Text>Claim Tokens</Text>
            </ThemeButton>
          )}
          {tokensStatus === 'claimed' && (
            <DisabledThemeButton>
              <Text>Tokens Claimed</Text>
            </DisabledThemeButton>
          )}
        </>
      );
    }
  };

  return (
    <BorderOnHover style={props.style} borderRadius={4} borderWidth={2}>
      <div className={styles.card}>
        <img src={props.image} />
        <div>
          <h4>{props.name}</h4>
          <p>{props.desc}</p>
          <div>
            {loading ? (
              <ThemeButton loading={true}>Querying</ThemeButton>
            ) : (
              renderButtons()
            )}
          </div>
        </div>
      </div>
    </BorderOnHover>
  );
};

const Text: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {props.children}
    </div>
  );
};

type Status = 'not-eligible' | 'claimable soon' | 'claimable' | 'claimed';
function status(
  got: boolean,
  contractStatus: 'unclaimable' | 'claimable' | 'claimed',
): Status {
  if (!got) return 'not-eligible';
  else if (contractStatus === 'claimable') return 'claimable';
  else if (contractStatus === 'unclaimable') return 'claimable soon';
  else if (contractStatus === 'claimed') return 'claimed';
  else return 'claimable soon';
}
