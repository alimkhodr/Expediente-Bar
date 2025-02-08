import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
    palette: {
        primary: {
            main: '#ffa507',
        },
        secondary: {
            main: '#ffffff',
        },
        background: {
            default: '#000000',
            paper: '#111111',
        },
        text: {
            primary: '#ffffff',
            secondary: '#000000',
            disabled: '#111111',
        },
    },
    typography: {
        fontFamily: "Montserrat, sans-serif",
    }
});

theme = responsiveFontSizes(theme);

export default theme;