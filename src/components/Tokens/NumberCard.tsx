import { Col, Row } from 'antd';
import type React from 'react';
import { useMemo } from 'react';
import styles from './NumberCard.less';
export const NumberCard: React.FC<{
  number: number;
}> = ({ number }) => {
  const pointArray = useMemo(() => {
    return number !== undefined
      ? number.toString().padStart(6, '0').split('')
      : new Array(6).fill('0');
  }, [number]);

  return (
    <Row align={'middle'} justify={'center'} gutter={12}>
      {pointArray.map((v, index) => (
        <Col key={index}>
          <div className={styles.pointCard}>{v}</div>
        </Col>
      ))}
    </Row>
  );
};
