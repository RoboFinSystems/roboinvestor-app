import tailwindcssTypography from '@tailwindcss/typography'
import flowbiteReact from 'flowbite-react/plugin/tailwindcss'
import flowbitePlugin from 'flowbite/plugin'
import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    '.flowbite-react/class-list.json',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // RoboInvestor Brand Colors
        // RoboInvestor brand: emerald primary, teal secondary, cyan accent.
        primary: {
          50: '#ECFDF5', // Lightest emerald
          100: '#D1FAE5', // Very light emerald
          200: '#A7F3D0', // Light emerald
          300: '#6EE7B7', // Soft emerald
          400: '#34D399', // Medium emerald
          500: '#10B981', // Bright emerald
          600: '#059669', // Strong emerald
          700: '#047857', // Deep emerald
          800: '#065F46', // Brand primary (dark emerald)
          900: '#064E3B', // Darker emerald
          950: '#022C22', // Darkest emerald
        },
        secondary: {
          50: '#F0FDFA', // Lightest teal
          100: '#CCFBF1', // Very light teal
          200: '#99F6E4', // Light teal
          300: '#5EEAD4', // Soft teal
          400: '#2DD4BF', // Bright teal
          500: '#14B8A6', // Brand secondary (teal)
          600: '#0D9488', // Medium teal
          700: '#0F766E', // Deep teal
          800: '#115E59', // Darker teal
          900: '#134E4A', // Very dark teal
          950: '#042F2E', // Darkest teal
        },
        accent: {
          50: '#ECFEFF', // Lightest cyan
          100: '#CFFAFE', // Very light cyan
          200: '#A5F3FC', // Light cyan
          300: '#67E8F9', // Soft cyan
          400: '#22D3EE', // Bright cyan
          500: '#06B6D4', // Brand accent (cyan)
          600: '#0891B2', // Strong cyan
          700: '#0E7490', // Deep cyan
          800: '#155E75', // Dark cyan
          900: '#164E63', // Very dark cyan
          950: '#083344', // Darkest cyan
        },
        // Shared semantic amber (decoupled from brand accent so `warning`
        // stays amber across all apps regardless of the per-app accent hue).
        amber: {
          50: '#FFF5F0',
          100: '#FFE6D9',
          200: '#FFD4C1',
          300: '#FFBFA6',
          400: '#FFA589',
          500: '#FF6B35',
          600: '#F54E17',
          700: '#DC4313',
          800: '#B93810',
          900: '#962D0D',
          950: '#731F08',
        },
        graph: {
          node: {
            primary: '#00D4AA', // Primary nodes
            secondary: '#3B7AF5', // Secondary nodes
            accent: '#FF6B35', // Important/highlight nodes
            inactive: '#94A3B8', // Inactive nodes
          },
          edge: {
            primary: '#93BBFD', // Primary relationships
            secondary: '#7FFFE6', // Secondary relationships
            highlight: '#FFA589', // Highlighted paths
            inactive: '#CBD5E1', // Inactive edges
          },
          cluster: {
            bg: 'rgba(59, 122, 245, 0.05)', // Cluster backgrounds
            border: '#BFDBFE', // Cluster borders
          },
        },
        semantic: {
          success: '#00D4AA', // Using secondary green
          warning: '#FF6B35', // Using accent orange
          error: '#DC2626', // Red for errors
          info: '#3B7AF5', // Using primary blue
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            h1: {
              color: '#1B3A57',
              fontSize: '2.25rem',
              fontWeight: '800',
            },
            h2: {
              color: '#1B3A57',
              fontSize: '1.875rem',
              fontWeight: '700',
            },
            h3: {
              color: '#1B3A57',
              fontSize: '1.5rem',
              fontWeight: '600',
            },
            h4: {
              color: '#1B3A57',
              fontSize: '1.25rem',
              fontWeight: '600',
            },
            a: {
              color: '#3B7AF5',
              '&:hover': {
                color: '#2563EB',
              },
            },
            code: {
              color: '#00D4AA',
              backgroundColor: '#E6FFFA',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            pre: {
              backgroundColor: '#1B3A57',
              color: '#E6FFFA',
            },
            blockquote: {
              borderLeftColor: '#00D4AA',
              color: '#4B5563',
            },
          },
        },
        dark: {
          css: {
            color: '#D1D5DB',
            h1: {
              color: '#F9FAFB',
            },
            h2: {
              color: '#F9FAFB',
            },
            h3: {
              color: '#F9FAFB',
            },
            h4: {
              color: '#F9FAFB',
            },
            a: {
              color: '#6098FA',
              '&:hover': {
                color: '#93BBFD',
              },
            },
            code: {
              color: '#1AFFD1',
              backgroundColor: 'rgba(0, 212, 170, 0.1)',
            },
            pre: {
              backgroundColor: '#111827',
              color: '#E5E7EB',
            },
            blockquote: {
              borderLeftColor: '#00D4AA',
              color: '#9CA3AF',
            },
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
    fontFamily: {
      body: [
        'Space Grotesk',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      sans: [
        'Space Grotesk',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      heading: [
        'Orbitron',
        'Space Grotesk',
        'ui-sans-serif',
        'system-ui',
        'sans-serif',
      ],
      mono: [
        'JetBrains Mono',
        'ui-monospace',
        'SFMono-Regular',
        'SF Mono',
        'Menlo',
        'Consolas',
        'Liberation Mono',
        'monospace',
      ],
    },
  },
  plugins: [flowbitePlugin, flowbiteReact, tailwindcssTypography],
} satisfies Config
