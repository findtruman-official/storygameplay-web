import type React from 'react';
import styles from './ThemeButton.less';

export const DisabledThemeButton: React.FC<{
  isMobile?: boolean;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ style, contentStyle, isMobile = false, children }) => {
  return (
    <div
      className={`${styles.themeButton}`}
      style={{ background: '#2E313A', cursor: 'not-allowed', ...(style || {}) }}
    >
      <div
        className={`${styles.themeButtonContent}`}
        style={{
          background: '#2E313A',
          color: '#FFFFFF',
          opacity: 0.3,
          ...(contentStyle || {}),
        }}
      >
        {children}
      </div>
    </div>
  );
};
