/**
 * SongTable.jsx — 검색 결과 테이블 + 빈 상태 UI
 *
 * 위치: src/components/SongTable.jsx
 *
 * 사용법:
 *   // 검색 결과 테이블
 *   <SongTable
 *     songs={results}
 *     savedSongIds={[1, 3, 5]}   // 이미 추가한 노래 id 목록
 *     onAdd={(song) => handleAdd(song)}
 *     onOpen={(song) => navigate(`/songs/${song.id}`)}
 *   />
 *
 *   // 빈 상태 (노래 없음)
 *   <EmptyState />
 *
 *   // 검색 결과 없음
 *   <EmptyState type="search" />
 */

import Button from './ui/Button'

// ── 검색 결과 테이블 ─────────────────────────────────────
export default function SongTable({ songs = [], savedSongIds = [], onAdd, onOpen }) {
    if (songs.length === 0) return null

    return (
        <div className="w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                        <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] w-[35%]">TITLE</th>
                        <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] w-[25%]">ARTIST</th>
                        <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden md:table-cell">ALBUM</th>
                        <th className="text-left px-4 py-3 font-medium text-[var(--color-text-secondary)] hidden md:table-cell w-[80px]">LENGTH</th>
                        <th className="px-4 py-3 w-[100px]"></th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index) => {
                        const isAdded = savedSongIds.includes(song.id)
                        return (
                            <tr
                                key={song.id ?? index}
                                className="border-b border-[var(--color-border)] last:border-0
                  hover:bg-[var(--color-surface-alt)] transition-colors duration-[var(--transition-fast)]"
                            >
                                <td className="px-4 py-3 text-[var(--color-text-primary)] font-medium truncate max-w-[160px]">
                                    {song.title}
                                </td>
                                <td className="px-4 py-3 text-[var(--color-text-secondary)] truncate max-w-[120px]">
                                    {song.artist}
                                </td>
                                <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden md:table-cell truncate max-w-[120px]">
                                    {song.album ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">
                                    {song.duration ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {isAdded ? (
                                        // 이미 추가한 노래 → Open 버튼
                                        <Button size="sm" onClick={() => onOpen?.(song)}>
                                            Open
                                        </Button>
                                    ) : (
                                        // 아직 추가 안 한 노래 → + Add 버튼
                                        <Button size="sm" variant="outline" onClick={() => onAdd?.(song)}>
                                            + Add
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

// ── 빈 상태 UI ───────────────────────────────────────────
export function EmptyState({ type = 'library' }) {
    const content = {
        library: {
            emoji: '🎵',
            title: '아직 노래가 없어요',
            desc: '검색해서 첫 번째 노래를 추가해보세요!',
        },
        search: {
            emoji: '🔍',
            title: '검색 결과가 없어요',
            desc: '다른 제목이나 아티스트로 검색해보세요.',
        },
    }

    const { emoji, title, desc } = content[type] ?? content.library

    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <span className="text-4xl">{emoji}</span>
            <p className="font-medium text-[var(--color-text-primary)]">{title}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{desc}</p>
        </div>
    )
}