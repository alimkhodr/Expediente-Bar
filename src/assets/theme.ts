import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
    palette: {
        primary: {
            main: '#253127',
        },
        secondary: {
            main: '#383838',
            A100: '#0D7977',
            A200: '#0A6060',
            A400: '#2ba048',
        },
        background: {
            default: '#E2D8BC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#253127',
            secondary: '#383838',
            disabled: '#A6A6A6',
        },
    },
    typography: {
        fontFamily: "Merriweather"
    }
});

theme = responsiveFontSizes(theme);

export default theme;