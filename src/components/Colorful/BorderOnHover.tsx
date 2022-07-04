import React from 'react';

// 悬浮放大 + 显示边框
//

export const BorderOnHover: React.FC<{
  isMobile?: boolean;
  onClick?: React.DOMAttributes<HTMLDivElement>['onClick'];
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  borderRadius?: React.CSSProperties['borderRadius'];
  borderWidth?: React.CSSProperties['padding'];
  alwaysShow?: boolean;
  children?: React.ReactNode;
}> = ({
  isMobile = false,
  style,
  hoverStyle,
  contentStyle: innerStyle,
  borderWidth = 2,
  children,
  borderRadius = '100%',
  onClick,
  alwaysShow,
}) => {
  let [isHover, setIsHover] = React.useState(false);

  const background =
    innerStyle?.backgroundColor || innerStyle?.background || '#1D1E27';

  return (
    <div
      style={{
        transition: 'all 0.5s',
        flex: 1,

        display: 'flex',
        justifyContent: 'stretch',
        alignItems: 'stretch',

        ...style,
        ...(isHover ? hoverStyle : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => {
        !isMobile && setIsHover(true);
      }}
      onTouchStart={() => {
        isMobile && setIsHover(true);
      }}
      onMouseLeave={() => {
        !isMobile && setIsHover(false);
      }}
      onTouchEnd={() => {
        isMobile && setIsHover(false);
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'stretch',
          alignItems: 'stretch',

          transition: 'all 0.5s',
          backgroundImage: 'linear-gradient(135deg, #5b4fff, #fb3120, #e2bdb9)',
          backgroundPosition: 0,
          boxSizing: 'border-box',
          borderRadius: borderRadius,
          width: '100%',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'stretch',
            alignItems: 'stretch',

            padding: borderWidth,
            borderRadius: `calc(${borderRadius} - 1%)`,
            background: alwaysShow || isHover ? 'transparent' : background,
            transition: 'all 0.5s',
            width: '100%',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'stretch',
              alignItems: 'stretch',

              transition: 'all 0.5s',
              background,
              borderRadius,
              ...innerStyle,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
