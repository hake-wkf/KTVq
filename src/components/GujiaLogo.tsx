import React from 'react';

interface GujiaLogoProps {
  size?: number;
  className?: string;
  roofOffset?: number; // 动态波动位移
  bodyOffset?: number; // 动态波动位移
}

/**
 * 严格按照用户上传的 "谷--logo.png" 像素级还原的矢量品牌 Logo
 * 橙色圆角方块背景 (#FF6500) + 白色极简"谷"字屋舍造型
 */
export default function GujiaLogo({
  size = 96,
  className = '',
  roofOffset = 0,
  bodyOffset = 0
}: GujiaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${className}`}
    >
      {/* 橙色 Squircle (方圆形) 背景 */}
      <rect
        x="6"
        y="6"
        width="228"
        height="228"
        rx="64"
        fill="#FF6500"
      />

      {/* 上层：屋檐折线 (可随声波律动微微平移) */}
      <path
        d="M 54 96 L 120 48 L 186 96"
        stroke="#FFFFFF"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: `translateY(${roofOffset}px)`,
          transition: 'transform 0.08s ease-out'
        }}
      />

      {/* 下层：谷舍主体 (两端微挑檐屋顶 + 饱满圆弧下仓) */}
      <path
        d="M 44 148 L 120 94 L 196 148 M 60 148 C 60 196 180 196 180 148"
        stroke="#FFFFFF"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: `translateY(${bodyOffset}px)`,
          transition: 'transform 0.08s ease-out'
        }}
      />
    </svg>
  );
}
