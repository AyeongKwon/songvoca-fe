/**
 * Input.jsx
 *
 * 사용법:
 *   <Input placeholder="maria@example.com" type="email" />
 *   <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
 *   <Input icon={<SearchIcon />} placeholder="사랑은..." />
 *   <Input error="이메일 형식이 올바르지 않습니다." />
 */

export default function Input({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    icon,
    error,
    label,
    className = '',
    disabled = false,
    id,
    ...props
}) {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

    const baseInput =
        'w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] border rounded-[var(--radius-md)] px-3 py-2 transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed';

    const borderStyle = error
        ? 'border-red-400 focus:ring-red-400'
        : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]';

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-[var(--color-text-primary)]"
                >
                    {label}
                </label>
            )}

            {/* icon을 왼쪽에 붙이는 경우 */}
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                        {icon}
                    </span>
                )}
                <input
                    id={inputId}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`${baseInput} ${borderStyle} ${icon ? 'pl-9' : ''}`}
                    {...props}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}