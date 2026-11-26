import React from 'react';

/**
 * ScoreGauge - Reusable circular SVG score meter for ATS, Job Match, and Skill Gap scores.
 *
 * @param {number} score - 0 to 100
 * @param {number} [size=120] - Diameter in pixels
 * @param {number} [strokeWidth=10] - Stroke thickness
 * @param {string} [label='Score'] - Subtitle label beneath number
 * @param {boolean} [showCategory=true] - Whether to render qualitative status (e.g. Needs Work, Good, Excellent)
 */
export const ScoreGauge = ({
  score = 0,
  size = 120,
  strokeWidth = 10,
  label = 'ATS Score',
  showCategory = true,
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  let color = '#ef4444'; // Red (< 50)
  let category = 'Needs Work';
  if (clampedScore >= 75) {
    color = '#10b981'; // Green (>= 75)
    category = 'Excellent';
  } else if (clampedScore >= 50) {
    color = '#f59e0b'; // Amber (50-74)
    category = 'Competitive';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
      role="meter"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${clampedScore} out of 100 (${category})`}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-base, #e2e8f0)"
            strokeWidth={strokeWidth}
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: size >= 140 ? '2rem' : size >= 100 ? '1.5rem' : '1.1rem',
              fontWeight: 800,
              lineHeight: 1,
              color: 'var(--text-primary, #0f172a)',
            }}
          >
            {clampedScore}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--text-muted, #64748b)',
              marginTop: 2,
            }}
          >
            / 100
          </span>
        </div>
      </div>

      {showCategory && (
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.15rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: `${color}18`,
              color,
            }}
          >
            {category}
          </span>
          {label && (
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary, #475569)',
                marginTop: '0.25rem',
                margin: 0,
              }}
            >
              {label}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreGauge;
