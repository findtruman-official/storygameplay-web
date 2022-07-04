import type React from 'react';
import styles from './TextButton.less';

export const TextButton: React.FC<{
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}> = (props) => {
  return (
    <div onClick={props.onClick} className={styles.btn}>
      {props.children}
    </div>
  );
};
