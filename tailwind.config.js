/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        fg:          'var(--fg)',
        'fg-muted':  'var(--fg-muted)',
        'fg-subtle': 'var(--fg-subtle)',
        bg:          'var(--bg)',
        'bg-elevated':'var(--bg-elevated)',
        'bg-sunken': 'var(--bg-sunken)',
        border:      'var(--border)',
        accent:      'var(--accent)',
        'accent-soft':'var(--accent-soft)',
        'accent-fg': 'var(--accent-fg)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body:    'var(--font-body)',
        label:   'var(--font-label)',
        mono:    'var(--font-mono)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        DEFAULT: 'var(--dur)',
        slow: 'var(--dur-slow)',
      },
      transitionTimingFunction: {
        ease: 'var(--ease)',
      },
      maxWidth: {
        container: 'var(--max-w)',
      },
    },
  },
  plugins: [],
};
