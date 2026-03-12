import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ReleaseItem {
  type: 'feature' | 'improvement' | 'fix'
  textKey: string
}

interface Release {
  version: string
  date: string
  titleKey: string
  items: ReleaseItem[]
}

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

const TYPE_ICONS: Record<string, string> = {
  feature: '✨',
  improvement: '⬆️',
  fix: '🐛',
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { t } = useTranslation()
  const [releases, setReleases] = useState<Release[]>([])

  useEffect(() => {
    if (isOpen) {
      fetch('/release-notes.json')
        .then((r) => r.json())
        .then(setReleases)
        .catch(() => setReleases([]))
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="about-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('about.title')}>
      <div className="about-modal" onClick={(e) => e.stopPropagation()}>
        <button className="about-close" onClick={onClose} aria-label={t('about.close')}>
          ✕
        </button>

        <header className="about-header">
          <div className="about-icon">🚗🚲🚌</div>
          <h2>{t('about.title')}</h2>
          <span className="about-version">v{__BUILD_VERSION__}</span>
        </header>

        <p className="about-description">{t('about.description')}</p>

        <div className="about-meta">
          <span>{t('about.madeWith')}</span>
          <span>•</span>
          <span>{t('about.team')}</span>
        </div>

        <h3 className="about-release-heading">{t('about.releaseNotes')}</h3>

        <div className="about-releases">
          {releases.map((release) => (
            <div key={release.version} className="release-entry">
              <div className="release-header">
                <span className="release-version">{release.version}</span>
                <span className="release-title">{t(release.titleKey)}</span>
                <span className="release-date">{release.date}</span>
              </div>
              <ul className="release-items">
                {release.items.map((item, i) => (
                  <li key={i}>
                    <span className="release-type-icon">{TYPE_ICONS[item.type]}</span>
                    <span className="release-type-label">{t(`release.${item.type}`)}</span>
                    <span>{t(item.textKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
