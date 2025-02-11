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
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    color: "#91948E",
                    "& label": {
                        color: "#91948E",
                    },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#91948E",
                        },
                        "&:hover fieldset": {
                            borderColor: "#ffa507",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#ffa507",
                        },
                        "& input": {
                            color: "#FFF",
                        },
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "#91948E", // Define a cor do label normal
                    "&.Mui-focused": {
                        color: "#ffa507", // Muda a cor quando focado
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    color: "#FFF",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#91948E",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffa507",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffa507",
                    },
                },
                icon: {
                    color: "#FFF",
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    color: "#FFF",
                    backgroundColor: "#111111", // Fundo do dropdown
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: "#FFF",
                    "&:hover": {
                        backgroundColor: "#ffa507",
                    },
                },
            },
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;
