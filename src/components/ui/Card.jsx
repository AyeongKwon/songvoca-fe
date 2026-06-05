/**
 * Card.jsx — 공용 카드 컴포넌트
 *
 * 두 가지 용도:
 *   1) 노래 카드  → <Card.Song />
 *   2) 단어 카드  → <Card.Word /> (플래시카드 앞/뒤 포함)
 *   3) 기본 래퍼  → <Card> ... </Card>
 *
 * 사용 예시:
 *
 *   // 노래 카드
 *   <Card.Song
 *     title="Spring Day"
 *     artist="BTS"
 *     status="learning"       // "learning" | "done" | "not_started"
 *     unknownCount={14}
 *     onClick={() => navigate(`/songs/${id}`)}
 *   />
 *
 *   // 단어 카드 (플래시카드)
 *   <Card.Word
 *     word="사랑하다"
 *     pos="verb"
 *     definition="to love"
 *     flipped={isFlipped}
 *     onClick={() => setIsFlipped(!isFlipped)}
 *   />
 *
 *   // 기본 래퍼
 *   <Card className="p-4">내용</Card>
 */

// ── 상태 배지 helper ────────────────────────────────────
const STATUS_MAP = {
    learning: {
        label: 'LEARNING',
        className: 'bg-[#FEF3C7] text-[#92400E]',
    },
    done: {
        label: 'DONE',
        className: 'bg-[#D1FAE5] text-[#065F46]',
    },
    not_started: {
        label: 'NEW',
        className: 'bg-[#E5E7EB] text-[#374151]',
    },
};

function StatusBadge({ status }) {
    const s = STATUS_MAP[status] ?? STATUS_MAP.not_started;
    return (
        <span
            className={`inline-block text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded-[var(--radius-sm)] ${s.className}`}
        >
            {s.label}
        </span>
    );
}

// ── 노래 카드 ────────────────────────────────────────────
function SongCard({ title, artist, status = 'not_started', unknownCount, onClick, className = '' }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        w-full text-left
        bg-[var(--color-surface)] border border-[var(--color-border)]
        rounded-[var(--radius-lg)] p-4
        hover:shadow-[var(--shadow-md)] hover:border-[var(--color-text-muted)]
        active:scale-[0.98]
        transition-all duration-[var(--transition-base)]
        ${className}
      `}
        >
            {/* 앨범 아트 placeholder + 텍스트 */}
            <div className="flex items-center gap-3">
                {/* 아이콘 원형 */}
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="text-[var(--color-text-muted)]">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--color-text-primary)] truncate">{title}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate">{artist}</p>
                </div>

                <StatusBadge status={status} />
            </div>

            {/* 미학습 단어 수 */}
            {unknownCount !== undefined && (
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    {unknownCount > 0
                        ? `${unknownCount}words left`
                        : 'All done! 🎉'}
                </p>
            )}
        </button>
    );
}

// ── 단어 카드 (플래시카드) ───────────────────────────────
// 앞면: 한국어 단어 / 뒷면: 영어 뜻 + 품사
// flipped prop으로 앞/뒤 제어, onClick으로 전환
function WordCard({ word, pos, definition, flipped = false, onClick, className = '' }) {
    return (
        /* 플립 컨테이너 */
        <div
            className={`relative w-full cursor-pointer select-none ${className}`}
            style={{ perspective: '1000px', minHeight: '220px' }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
            aria-label={flipped ? `Back: ${definition}` : `Front: ${word}`}
        >
            {/* 플립 내부 wrapper */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    minHeight: '220px',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.45s ease',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* ── 앞면: 한국어 단어 ── */}
                <div
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    className="absolute inset-0 flex flex-col items-center justify-center
            bg-[var(--color-surface)] border border-[var(--color-border)]
            rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-sm)]"
                >
                    <p className="text-4xl font-[var(--font-display)] text-[var(--color-text-primary)] mb-3">
                        {word}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">tap to see meaning</p>
                </div>

                {/* ── 뒷면: 번역 + 품사 ── */}
                <div
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center
            bg-[var(--color-accent)] border border-[var(--color-accent)]
            rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-sm)]"
                >
                    <p className="text-3xl font-[var(--font-display)] text-[var(--color-accent-fg)] mb-2">
                        {definition}
                    </p>
                    {pos && (
                        <span className="text-xs font-medium text-[var(--color-accent-fg)] opacity-60 uppercase tracking-widest">
                            {pos}
                        </span>
                    )}
                    <p className="text-xs text-[var(--color-accent-fg)] opacity-40 mt-3">tap to flip back</p>
                </div>
            </div>
        </div>
    );
}

// ── 기본 래퍼 ────────────────────────────────────────────
function Card({ children, className = '', onClick }) {
    const base = `bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]`;
    return onClick ? (
        <button type="button" onClick={onClick} className={`${base} w-full text-left ${className}`}>
            {children}
        </button>
    ) : (
        <div className={`${base} ${className}`}>{children}</div>
    );
}

// ── 서브 컴포넌트 붙이기 ─────────────────────────────────
Card.Song = SongCard;
Card.Word = WordCard;
Card.StatusBadge = StatusBadge;

export default Card;