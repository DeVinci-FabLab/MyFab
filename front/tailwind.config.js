const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    safelist: [
      'bg-red-500',
      'to-blue-500',
      'from-emerald-300',
      'bg-red-100',
      'text-red-800'
    ],
  theme: {
    extend: {
        'animation': {
            'gradient-x':'gradient-x 3s ease infinite',
            'gradient-y':'gradient-y 15s ease infinite',
            'gradient-xy':'gradient-xy 15s ease infinite',
            'gradient-placeholder':'loading 1s ease infinite',
            'blob': "blob 7s infinite",
        },
        'keyframes': {
          'blob': {
            "0%": {
              'transform': "translate(0px, 0px) scale(1)",
            },
            "33%": {
              'transform': "translate(30px, -50px) scale(1.1)",
            },
            "66%": {
              'transform': "translate(-20px, 20px) scale(0.9)",
            },
            "100%": {
              'transform': "tranlate(0px, 0px) scale(1)",
            },
          },
          'loading': {
            '0%':{
                'left': '-45%',

            },
            '100%':{
                'left': '55%',
                'background-image': 'linear-gradient(to left, rgba(251,251,251, .05))',
                'background-image': '-moz-linear-gradient(to left, rgba(251,251,251, .05))',
                'background-image': '-webkit-linear-gradient(to left, rgba(251,251,251, .05))',
                        },
          },
            'gradient-y': {
                '0%, 100%': {
                    'background-size':'400% 400%',
                    'background-position': 'center top'
                },
                '50%': {
                    'background-size':'200% 200%',
                    'background-position': 'center center'
                }
            },
            'gradient-x': {
                '0%, 100%': {
                    'background-size':'200% 200%',
                    'background-position': 'left center',
                },
                '50%': {
                    'background-size':'200% 200%',
                    'background-position': 'right center',
                }
            },
            'gradient-xy': {
                '0%, 100%': {
                    'background-size':'400% 400%',
                    'background-position': 'left center'
                },
                '50%': {
                    'background-size':'200% 200%',
                    'background-position': 'right center'
                }
            }
        }
    },
    fontFamily: {
      sans: ['Quicksand', 'sans-serif']
    }
},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    plugin(function({ addUtilities }) {
        const utilFormSwitch = {
          '.form-switch': {
            'border': 'transparent',
            'background-color': colors.gray[300],
            'background-image': "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e\")",
            'background-position': 'left center',
            'background-repeat': 'no-repeat',
            'background-size': 'contain !important',
            'vertical-align': 'top',
            '&:checked': {
              'border': 'transparent',
              'background-color': 'currentColor',
              'background-image': "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e\")",
              'background-position': 'right center',
            },
            '&:disabled, &:disabled + label': {
              'opacity': '.5',
              'cursor': 'not-allowed',
            },
          },
        }
  
        addUtilities(utilFormSwitch)
      }),
  ],
}
