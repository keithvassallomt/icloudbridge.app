import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'iCloudBridge',
  description: 'User Guide for iCloudBridge - Sync Your Apple Data',
  base: '/docs/',
  outDir: '../public/docs',
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/assets/iCloudBridge_transparent.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/user' },
      { text: 'Main Site', link: 'https://icloudbridge.app' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'User Guide', link: '/user' },
          { text: 'Installing & Running', link: '/installing' },
          { text: 'First-Run Wizard', link: '/firstrun' }
        ]
      },
      {
        text: 'Using iCloudBridge',
        items: [
          { text: 'WebUI Navigation', link: '/navigation' },
          { text: 'Note Synchronisation', link: '/notes' },
          { text: 'Reminder Synchronisation', link: '/reminders' },
          { text: 'Password Synchronisation', link: '/passwords' },
          { text: 'Photo Synchronisation', link: '/photos' },
          { text: 'Schedules', link: '/schedules' },
          { text: 'Logs', link: '/logs' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/keithvassallomt/icloudbridge' }
    ],

    footer: {
      message: 'iCloudBridge Documentation',
      copyright: 'Copyright © 2025 Keith Vassallo'
    },

    search: {
      provider: 'local'
    }
  },

  // Custom theme colors matching the main site
  head: [
    [
      'style',
      {},
      `
      :root {
        --vp-c-brand-1: #05C73B;
        --vp-c-brand-2: #048A31;
        --vp-c-brand-3: #05766A;
        --vp-c-brand-soft: rgba(5, 199, 59, 0.14);

        /* Light mode custom colors */
        --vp-c-bg: #F8FDF9;
        --vp-c-bg-alt: #EBF5EF;
        --vp-c-bg-elv: #F8FDF9;
        --vp-c-bg-soft: #E8F4ED;
      }

      .dark {
        --vp-c-brand-1: #06EA46;
        --vp-c-brand-2: #22E561;
        --vp-c-brand-3: #05C73B;
        --vp-c-brand-soft: rgba(6, 234, 70, 0.14);

        /* Dark mode custom colors */
        --vp-c-bg: #05170A;
        --vp-c-bg-alt: #1F3123;
        --vp-c-bg-elv: #1F3123;
        --vp-c-bg-soft: #0D2415;
        --vp-c-text-1: #f5f5f7;
        --vp-c-text-2: #a8b5b0;
      }

      /* Custom styling for better visual consistency */
      .VPNavBar {
        border-bottom: 1px solid var(--vp-c-divider);
        background-color: var(--vp-c-bg);
      }

      .VPSidebar {
        background-color: var(--vp-c-bg-alt);
      }

      /* Feature icons - use brand colors */
      .VPFeature .VPImage[src*=".svg"] {
        /* Dark green for light mode: #048A31 */
        filter: brightness(0) saturate(100%) invert(33%) sepia(91%) saturate(817%) hue-rotate(100deg) brightness(93%) contrast(97%);
      }

      .dark .VPFeature .VPImage[src*=".svg"] {
        /* Light green for dark mode: #06EA46 */
        filter: brightness(0) saturate(100%) invert(80%) sepia(35%) saturate(3062%) hue-rotate(74deg) brightness(99%) contrast(95%);
      }
      `
    ]
  ]
})
