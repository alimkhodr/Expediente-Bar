import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './assets/theme.ts'
import { SnackbarProvider } from 'notistack'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
