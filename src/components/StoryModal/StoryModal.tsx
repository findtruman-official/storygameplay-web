import type React from 'react';
import { Col, Modal, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './StroyModal.less';
import { IconFont } from '@/utils';
import { PauseCircleFilled, PlayCircleFilled } from '@ant-design/icons';
import ThemeButton from '@/components/ThemeButton/ThemeButton';

interface Props {
  data?: {
    name: string;
    videoUrl: string;
    gameSceneUrl?: string;
    storySceneUrl?: string;
    twitterUrl?: string;
  };
  visible: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<Props> = ({ data, visible, onClose }) => {
  const ref = useRef<HTMLVideoElement>(null);

  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {}, [visible]);

  return (
    <Modal
      centered={true}
      visible={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      title={null}
      bodyStyle={{ padding: 0 }}
      width={1000}
      destroyOnClose={true}
    >
      {data && (
        <>
          {data.videoUrl && (
            <div className={styles.videoContainer}>
              <video
                ref={ref}
                className={styles.customVideo}
                autoPlay={true}
                playsInline={true}
                muted={muted}
                src={data.videoUrl}
              />
              <div className={styles.videoButtons}>
                {playing ? (
                  <PauseCircleFilled
                    className={styles.videoButton}
                    onClick={() => {
                      setPlaying(false);
                      ref.current?.pause();
                    }}
                  />
                ) : (
                  <PlayCircleFilled
                    className={styles.videoButton}
                    onClick={() => {
                      setPlaying(true);
                      ref.current?.play();
                    }}
                  />
                )}
                {muted ? (
                  <IconFont
                    className={styles.videoButton}
                    style={{ fontSize: 36 }}
                    type={'icon-sound-Mute'}
                    onClick={() => setMuted(false)}
                  />
                ) : (
                  <IconFont
                    className={styles.videoButton}
                    style={{ fontSize: 36 }}
                    type={'icon-sound-filling-fill'}
                    onClick={() => setMuted(true)}
                  />
                )}
              </div>
            </div>
          )}
          <div style={{ padding: 24 }}>
            <div className={styles.storyName}>{data.name}</div>
            <Row align={'middle'} justify={'space-evenly'}>
              {data.gameSceneUrl && (
                <Col>
                  <a href={data.gameSceneUrl} target={'_blank'}>
                    <ThemeButton
                      contentStyle={{
                        fontSize: 18,
                        padding: '4px 30px',
                        width: 160,
                      }}
                      onClick={() => {}}
                    >
                      Play
                    </ThemeButton>
                  </a>
                </Col>
              )}
              {data.storySceneUrl && (
                <Col>
                  <a href={data.storySceneUrl} target={'_blank'}>
                    <ThemeButton
                      contentStyle={{
                        fontSize: 18,
                        padding: '4px 30px',
                        width: 160,
                      }}
                      onClick={() => {}}
                    >
                      Write Story
                    </ThemeButton>
                  </a>
                </Col>
              )}
              {data.twitterUrl && (
                <Col>
                  <a href={data.twitterUrl} target={'_blank'}>
                    <ThemeButton
                      contentStyle={{
                        fontSize: 18,
                        padding: '4px 30px',
                        width: 160,
                      }}
                      onClick={() => {}}
                    >
                      View Story
                    </ThemeButton>
                  </a>
                </Col>
              )}
            </Row>
          </div>
        </>
      )}
    </Modal>
  );
};
