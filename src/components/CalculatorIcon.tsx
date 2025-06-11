import React from 'react';

interface CalculatorIconProps {
  className?: string;
}

const CalculatorIcon: React.FC<CalculatorIconProps> = ({ className }) => {
  // Генерация уникального суффикса для ID, чтобы избежать конфликтов
  const idSuffix = React.useId(); 

  return (
    <svg viewBox="0 0 220 300" xmlns="http://www.w3.org/2000/svg"
         fontFamily="Segoe UI, Roboto, sans-serif" strokeLinecap="round"
         strokeLinejoin="round" className={className}>

      {/* ======= Палитра & эффекты ======= */}
      <defs>
        {/* Основной вертикальный градиент корпуса */}
        <linearGradient id={`bodyGrad-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#0E5669"/>
          <stop offset="100%" stopColor="#0A3947"/>
        </linearGradient>

        {/* Градиент для кнопок */}
        <linearGradient id={`btnGrad-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#1FB3C4"/>
          <stop offset="100%" stopColor="#13889A"/>
        </linearGradient>

        {/* Тень под калькулятором */}
        <filter id={`shadow-${idSuffix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dy="4" stdDeviation="2" in="SourceAlpha" result="off"/>
          <feGaussianBlur stdDeviation="6" in="off" result="blur"/>
          <feColorMatrix type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.25 0" in="blur" result="shadow"/>
          <feBlend in="shadow" in2="SourceGraphic" mode="normal"/>
        </filter>
      </defs>

      {/* ======= Корпус ======= */}
      <g filter={`url(#shadow-${idSuffix})`}>
        <rect x="10" y="10" width="200" height="280" rx="18" ry="18"
              fill={`url(#bodyGrad-${idSuffix})`}/>
      </g>

      {/* ======= Экран ======= */}
      <rect x="28" y="28" width="164" height="60" rx="8" ry="8"
            fill="#001E28" stroke="#0C8398" strokeWidth="2"/>
      <text x="44" y="70" fill="#21D4E2" fontSize="32" letterSpacing="1.5">123</text>

      {/* ======= Сетка кнопок (4×5) ======= */}
      {/* Размеры/отступы */}
      <g id={`buttons-${idSuffix}`} transform="translate(28,108)">
        {/* Колонки: 0…3, строки: 0…4 */}
        {/* Ширина 40, высота 42, шаг по X = 48, шаг по Y = 50 */}
        {/* Перебор вручную ради читабельности */}
        {/* Row 0 */}
        <rect x="0"   y="0"  width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="48"  y="0"  width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="96"  y="0"  width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="144" y="0"  width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        {/* Row 1 */}
        <rect x="0"   y="50" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="48"  y="50" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="96"  y="50" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="144" y="50" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        {/* Row 2 */}
        <rect x="0"   y="100" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="48"  y="100" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="96"  y="100" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="144" y="100" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        {/* Row 3 */}
        <rect x="0"   y="150" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="48"  y="150" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="96"  y="150" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="144" y="150" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        {/* Row 4 */}
        <rect x="0"   y="200" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="48"  y="200" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="96"  y="200" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>
        <rect x="144" y="200" width="40" height="42" rx="6" fill={`url(#btnGrad-${idSuffix})`}/>

        {/* ======= Метки кнопок ======= */}
        {/* Первые три строки: цифры */}
        <g fontSize="18" fill="#FFFFFF" textAnchor="middle" dominantBaseline="central">
          {/* Row 0 */}
          <text x="20"  y="21">7</text> <text x="68"  y="21">8</text>
          <text x="116" y="21">9</text> <text x="164" y="21">÷</text>
          {/* Row 1 */}
          <text x="20"  y="71">4</text> <text x="68"  y="71">5</text>
          <text x="116" y="71">6</text> <text x="164" y="71">×</text>
          {/* Row 2 */}
          <text x="20"  y="121">1</text> <text x="68"  y="121">2</text>
          <text x="116" y="121">3</text> <text x="164" y="121">−</text>
          {/* Row 3 */}
          <text x="20"  y="171">0</text> <text x="68"  y="171">.</text>
          <text x="116" y="171">±</text> <text x="164" y="171">+</text>
          {/* Row 4 */}
          <text x="20"  y="221">AC</text> <text x="68"  y="221">%</text>
          <text x="116" y="221">M</text> <text x="164" y="221">=</text>
        </g>
      </g>
    </svg>
  );
};

export default CalculatorIcon; 