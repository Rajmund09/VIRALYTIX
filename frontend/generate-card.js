const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const width = 1200;
const height = 780;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFAF6" />
      <stop offset="50%" stop-color="#F7F3EC" />
      <stop offset="100%" stop-color="#F2EDE4" />
    </linearGradient>

    <!-- 3D Glossy Lamination Specular Sheen -->
    <linearGradient id="glossSheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.7)" />
      <stop offset="25%" stop-color="rgba(255,255,255,0.15)" />
      <stop offset="45%" stop-color="rgba(255,255,255,0.4)" />
      <stop offset="60%" stop-color="rgba(255,255,255,0.05)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </linearGradient>

    <linearGradient id="barGreen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00A82F" />
      <stop offset="100%" stop-color="#00E83F" />
    </linearGradient>

    <linearGradient id="barBlue" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0066FF" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>

    <linearGradient id="barRed" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#FB7185" />
    </linearGradient>

    <linearGradient id="barAmber" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#FBBF24" />
    </linearGradient>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="rgba(0,0,0,0.12)" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.06)" />
    </filter>

    <filter id="tileShadow" x="-5%" y="-5%" width="110%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.04)" />
    </filter>
  </defs>

  <!-- Base Smooth Archival Paper Card with Foil Rim -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="32" ry="32" 
        fill="url(#cardBg)" stroke="#E5DDD0" stroke-width="2.5" filter="url(#cardShadow)" />
  <rect x="23" y="23" width="${width - 46}" height="${height - 46}" rx="29" ry="29" 
        fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" />

  <!-- Diagonal Gloss Sheen Overlay -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="32" ry="32" 
        fill="url(#glossSheen)" opacity="0.65" pointer-events="none" />

  <!-- Corner Precision Crosshairs -->
  <text x="45" y="55" font-family="monospace" font-size="16" fill="#8C8275" opacity="0.5">+</text>
  <text x="${width - 55}" y="55" font-family="monospace" font-size="16" fill="#8C8275" opacity="0.5">+</text>
  <text x="45" y="${height - 45}" font-family="monospace" font-size="16" fill="#8C8275" opacity="0.5">+</text>
  <text x="${width - 55}" y="${height - 45}" font-family="monospace" font-size="16" fill="#8C8275" opacity="0.5">+</text>

  <!-- Header Area -->
  <g transform="translate(60, 60)">
    <!-- Status Dot -->
    <circle cx="10" cy="22" r="8" fill="#008A20" opacity="0.25" />
    <circle cx="10" cy="22" r="5" fill="#008A20" />

    <!-- Title and Subtitle -->
    <text x="32" y="20" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="20" fill="#14120E" letter-spacing="1">
      SHAP FORCE VECTOR BALANCER
    </text>
    
    <!-- Badge -->
    <rect x="420" y="4" width="120" height="24" rx="12" fill="#14120E" fill-opacity="0.08" stroke="#14120E" stroke-opacity="0.15" />
    <text x="480" y="20" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#14120E" letter-spacing="1">
      GLOSSY PRINT
    </text>

    <text x="32" y="44" font-family="monospace" font-weight="600" font-size="12" fill="#008A20" letter-spacing="1.5">
      MODEL: XGBOOST REGRESSOR • 32 COGNITIVE SIGNALS
    </text>

    <!-- Score Readout Pill (Right side) -->
    <g transform="translate(840, -10)">
      <rect x="0" y="0" width="240" height="66" rx="20" fill="#181614" stroke="#2E2822" stroke-width="1.5" />
      <text x="24" y="38" font-family="monospace" font-weight="600" font-size="11" fill="#FFFFFF" fill-opacity="0.6" letter-spacing="1.5">
        TOTAL SCORE:
      </text>
      <text x="145" y="46" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#00E83F" letter-spacing="-1">
        91.2
      </text>
      <text x="208" y="40" font-family="monospace" font-weight="700" font-size="13" fill="#FFFFFF" fill-opacity="0.8">
        /100
      </text>
    </g>

    <!-- Horizontal Divider -->
    <line x1="0" y1="80" x2="${width - 120}" y2="80" stroke="#E3DBD0" stroke-width="1.5" />
  </g>

  <!-- Vector Channels (2x2 Grid) -->
  <!-- Channel 1: Hook Power -->
  <g transform="translate(60, 180)">
    <rect x="0" y="0" width="520" height="230" rx="18" fill="#F5EFE7" stroke="#E5DDD2" stroke-width="1.5" filter="url(#tileShadow)" />
    
    <text x="24" y="42" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="16" fill="#14120E">
      <tspan fill="#008A20" font-weight="900">+ </tspan>0-3s Hook Power &amp; Text Overlay
    </text>
    
    <rect x="420" y="24" width="76" height="26" rx="6" fill="#008A20" fill-opacity="0.12" stroke="#008A20" stroke-opacity="0.3" />
    <text x="458" y="41" text-anchor="middle" font-family="monospace" font-weight="700" font-size="13" fill="#008A20">
      +18.4 pts
    </text>

    <!-- Progress Track & Bar -->
    <rect x="24" y="90" width="472" height="14" rx="7" fill="#E5DDD2" />
    <rect x="24" y="90" width="415" height="14" rx="7" fill="url(#barGreen)" />

    <!-- Submetrics -->
    <text x="24" y="165" font-family="monospace" font-weight="600" font-size="12" fill="#7D7569" letter-spacing="1">
      MOTION INDEX: 0.88
    </text>
    <text x="496" y="165" text-anchor="end" font-family="monospace" font-weight="600" font-size="12" fill="#7D7569" letter-spacing="1">
      SYNC: &lt;120ms
    </text>

    <text x="24" y="195" font-family="monospace" font-weight="700" font-size="11" fill="#008A20" letter-spacing="1">
      CONFIDENCE: 98.4% • RETENTION LIFT: OPTIMAL
    </text>
  </g>

  <!-- Channel 2: Optical Motion Vectors -->
  <g transform="translate(620, 180)">
    <rect x="0" y="0" width="520" height="230" rx="18" fill="#F5EFE7" stroke="#E5DDD2" stroke-width="1.5" filter="url(#tileShadow)" />
    
    <text x="24" y="42" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="16" fill="#14120E">
      <tspan fill="#0066FF" font-weight="900">+ </tspan>Optical Motion Vectors &amp; Scene Cut Speed
    </text>
    
    <rect x="420" y="24" width="76" height="26" rx="6" fill="#0066FF" fill-opacity="0.12" stroke="#0066FF" stroke-opacity="0.3" />
    <text x="458" y="41" text-anchor="middle" font-family="monospace" font-weight="700" font-size="13" fill="#0066FF">
      +12.6 pts
    </text>

    <!-- Progress Track & Bar -->
    <rect x="24" y="90" width="472" height="14" rx="7" fill="#E5DDD2" />
    <rect x="24" y="90" width="306" height="14" rx="7" fill="url(#barBlue)" />

    <!-- Submetrics -->
    <text x="24" y="165" font-family="monospace" font-weight="600" font-size="12" fill="#7D7569" letter-spacing="1">
      CADENCE: 1.8s AVG
    </text>
    <text x="496" y="165" text-anchor="end" font-family="monospace" font-weight="600" font-size="12" fill="#7D7569" letter-spacing="1">
      ABANDONMENT: MINIMAL
    </text>

    <text x="24" y="195" font-family="monospace" font-weight="700" font-size="11" fill="#0066FF" letter-spacing="1">
      VELOCITY RATIO: 1.42x • CUT FLUIDITY: HIGH
    </text>
  </g>

  <!-- Channel 3: Prolonged Speech Silence Gap -->
  <g transform="translate(60, 450)">
    <rect x="0" y="0" width="520" height="230" rx="18" fill="#F5EFE7" stroke="#E5DDD2" stroke-width="1.5" filter="url(#tileShadow)" />
    
    <text x="24" y="42" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="16" fill="#14120E">
      <tspan fill="#E11D48" font-weight="900">- </tspan>Prolonged Speech Silence Gap
    </text>
    
    <rect x="420" y="24" width="76" height="26" rx="6" fill="#E11D48" fill-opacity="0.12" stroke="#E11D48" stroke-opacity="0.3" />
    <text x="458" y="41" text-anchor="middle" font-family="monospace" font-weight="700" font-size="13" fill="#E11D48">
      -7.2 pts
    </text>

    <!-- Progress Track & Bar -->
    <rect x="24" y="90" width="472" height="14" rx="7" fill="#E5DDD2" />
    <rect x="24" y="90" width="180" height="14" rx="7" fill="url(#barRed)" />

    <!-- Submetrics -->
    <text x="24" y="165" font-family="monospace" font-weight="600" font-size="12" fill="#7D7569" letter-spacing="1">
      SILENCE: 1.2s AT 0:14
    </text>
    <text x="496" y="165" text-anchor="end" font-family="monospace" font-weight="600" font-size="12" fill="#7D7569" letter-spacing="1">
      DROP-OFF RISK: HIGH
    </text>

    <text x="24" y="195" font-family="monospace" font-weight="700" font-size="11" fill="#E11D48" letter-spacing="1">
      PACING FRICTION: DETECTED • EDIT ADVICE: TIGHTEN GAP
    </text>
  </g>

  <!-- Channel 4: Semantic Climax & Narrative Peak -->
  <g transform="translate(620, 450)">
    <rect x="0" y="0" width="520" height="230" rx="18" fill="#F5EFE7" stroke="#E5DDD2" stroke-width="1.5" filter="url(#tileShadow)" />
    
    <text x="24" y="42" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="16" fill="#14120E">
      <tspan fill="#D97706" font-weight="900">+ </tspan>Semantic Climax &amp; Narrative Peak
    </text>
    
    <rect x="420" y="24" width="76" height="26" rx="6" fill="#D97706" fill-opacity="0.12" stroke="#D97706" stroke-opacity="0.3" />
    <text x="458" y="41" text-anchor="middle" font-family="monospace" font-weight="700" font-size="13" fill="#D97706">
      +7.4 pts
    </text>

    <!-- Progress Track & Bar -->
    <rect x="24" y="90" width="472" height="14" rx="7" fill="#E5DDD2" />
    <rect x="24" y="90" width="340" height="14" rx="7" fill="url(#barAmber)" />

    <!-- Submetrics -->
    <text x="24" y="165" font-family="monospace" font-weight="600" font-size="12" fill="#7D7569" letter-spacing="1">
      POLARITY SPIKE: 0:28
    </text>
    <text x="496" y="165" text-anchor="end" font-family="monospace" font-weight="600" font-size="12" fill="#7D7569" letter-spacing="1">
      COMMENT VELOCITY: HIGH
    </text>

    <text x="24" y="195" font-family="monospace" font-weight="700" font-size="11" fill="#D97706" letter-spacing="1">
      EMOTIONAL INTENSITY: 8.9/10 • SHARE PROPENSITY: +42%
    </text>
  </g>
</svg>
`;

async function main() {
  const outputPath = path.join(__dirname, 'public', 'cards', 'shap-glossy-paper-card.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 100 })
    .toFile(outputPath);
  console.log('Successfully written to', outputPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
