/**
 * Button.jsx
 *
 * 사용법:
 *   <Button>저장</Button>
 *   <Button variant="outline">취소</Button>
 *   <Button variant="ghost">더보기</Button>
 *   <Button size="sm" variant="primary">+ Add</Button>
 *   <Button disabled>비활성화</Button>
 */

const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

const variantStyles = {
    // UI 스케치의 검정 "Log in", "Open lyrics" 버튼
    primary:
        'bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:opacity-80 border border-transparent',

    // 흰 배경 외곽선 버튼 ("I don't know" 등)
    outline:
        'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]',

    // 텍스트만 (링크형)
    ghost:
        'bg-transparent text-[var(--color-text-secondary)] border border-transparent hover:bg-[var(--color-surface-alt)]',

    // 위험 동작 (삭제 등)
    danger:
        'bg-red-500 text-white border border-transparent hover:bg-red-600',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    type = 'button',
    onClick,
    ...props
}) {
    const base =
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-all duration-[var(--transition-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed select-none';

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}