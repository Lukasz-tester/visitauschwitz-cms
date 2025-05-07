//BELOW version which sets theme initially to dark:
// import Script from 'next/script'
// import React from 'react'
// import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

// export const InitTheme: React.FC = () => {
//   return (
//     <Script
//       dangerouslySetInnerHTML={{
//         __html: `
//           (function () {
//             var preference = window.localStorage.getItem('${themeLocalStorageKey}');
//             var themeToSet = preference === 'light' ? 'light' : '${defaultTheme}';
//             document.documentElement.setAttribute('data-theme', themeToSet);
//           })();
//         `,
//       }}
//       id="theme-script"
//       strategy="beforeInteractive"
//     />
//   )
// }

import Script from 'next/script'
import React from 'react'
import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

export const InitTheme: React.FC = () => {
  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: `
          (function () {
            function getImplicitPreference() {
              var mediaQuery = '(prefers-color-scheme: dark)'
              var mql = window.matchMedia(mediaQuery)
              if (mql.matches) {
                return 'dark'
              } else {
                return 'light'
              }
            }

            var theme = window.localStorage.getItem('${themeLocalStorageKey}');
            var themeToSet = null;

            if (theme === 'light' || theme === 'dark') {
              themeToSet = theme; // Use the theme stored in localStorage
            } else {
              themeToSet = getImplicitPreference(); // If no theme, fall back to system preference
            }

            document.documentElement.setAttribute('data-theme', themeToSet);
            window.localStorage.setItem('${themeLocalStorageKey}', themeToSet); // Save the theme to localStorage
          })();
        `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
