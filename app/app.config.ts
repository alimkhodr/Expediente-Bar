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
        base: 'font-bold rounded-xl',
        header: 'pb-0',
        footer: 'pt-0'
      }
    },
    alert: {
      slots: {
        root: 'rounded-2xl'
      }
    }
  }
})
