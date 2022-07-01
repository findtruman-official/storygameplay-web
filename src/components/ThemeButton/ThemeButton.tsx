import type React from 'react';
import type { DOMAttributes } from 'react';
import styles from './ThemeButton.less';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
  isMobile?: boolean;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  onClick?: DOMAttributes<HTMLDivElement>['onClick'];
  loading?: boolean;
  children: React.ReactNode | string;
}

const ThemeButton: React.FC<Props> = ({
  isMobile = false,
  style,
  contentStyle,
  onClick,
  loading,
  children,
}) => {
  return (
    <div
      onClick={(e) => {
        !loading && onClick && onClick(e);
      }}
      className={`${styles.themeButton} ${
        onClick && !loading ? styles.themeButtonClickable : ''
      } ${loading ? styles.themeButtonLoading : ''}`}
      style={{ ...(style || {}) }}
    >
      <div
        className={`${styles.themeButtonContent} ${
          onClick && !loading
            ? isMobile
              ? styles.themeButtonContentClickableMobile
              : styles.themeButtonContentClickable
            : ''
        }`}
        style={{
          ...(contentStyle || {}),
        }}
      >
        {loading && <LoadingOutlined style={{ marginRight: 8 }} />}
        {children}
      </div>
    </div>
  );
};

export default ThemeButton;
