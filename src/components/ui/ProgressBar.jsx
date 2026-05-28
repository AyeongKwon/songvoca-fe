/**
 * ProgressBar.jsx — 학습 진도 바
 *
 * 위치: src/components/ui/ProgressBar.jsx
 *
 * 사용법:
 *   // 기본
 *   <ProgressBar value={7} max={24} />
 *
 *   // 라벨 표시
 *   <ProgressBar value={7} max={24} showLabel />
 *
 *   // 플래시카드 모드 (카드 번호 표시)
 *   <ProgressBar value={7} max={24} showLabel labelFormat="card" />
 */

export default function ProgressBar({
    value = 0,
    max = 100,
    showLabel = false,
    labelFormat = 'percent', // 'percent' | 'card'
    className = '',
}) {
    const percent = max === 0 ? 0 : Math.min(Math.round((value / max) * 100), 100)

    const label =
        labelFormat === 'card'
            ? `${value} / ${max}`   // "7 / 24"
            : `${percent}%`         // "29%"

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-[--color-text-muted]">진도</span>
                    <span className="text-xs font-medium text-[--color-text-secondary]">{label}</span>
                </div>
            )}

            {/* 트랙 */}
            <div className="w-full h-1.5 bg-[--color-border] rounded-full overflow-hidden">
                {/* 채워지는 바 */}
                <div
                    className="h-full bg-[--color-accent] rounded-full transition-all duration-[--transition-slow]"
                    style={{ width: `${percent}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-label={`${label} 완료`}
                />
            </div>
        </div>
    )
}