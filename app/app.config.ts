export default defineAppConfig({
  ui: {
    colors: {
      primary: 'yellow',
      neutral: 'stone'
    },
    button: {
      slots: {
        base: 'rounded-xl'
      }
    },
    card: {
      slots: {
        root: 'rounded-2xl',
        base: 'font-bold rounded-xl'
      }
    },
    alert: {
      slots: {
        root: 'rounded-2xl'
      }
    },
    container: {
      base: 'w-full max-w-(--ui-container) mx-auto px-4 py-6 sm:py-8 lg:py-10 sm:px-6 lg:px-8'
    }
  }
})
