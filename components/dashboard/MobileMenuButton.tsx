'use client'

export function MobileMenuButton() {
  function toggle() {
    window.dispatchEvent(new Event('sidebar-toggle'))
  }

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={toggle}
        aria-label="Open navigation menu"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="3" y1="6"  x2="21" y2="6"  />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <style>{`
        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: transparent;
          border: 1px solid var(--border);
          color: var(--fg);
          cursor: pointer;
          transition: background var(--transition-fast);
          flex-shrink: 0;
        }
        .mobile-menu-btn:hover { background: var(--bg-sunken); }

        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
        }
      `}</style>
    </>
  )
}
