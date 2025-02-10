import { Container, IconButton, styled, Typography } from '@mui/material';
import NorthIcon from '@mui/icons-material/North';

const Footer = () => {
    const StyledFooter = styled('div')(({ theme }) => ({
        padding: '40px 0px',
        backgroundColor: theme.palette.background.paper,
    }));

    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.text.secondary,
        transition: "background-color 0.3s ease",
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.secondary,
        },
    }));


    return (
        <StyledFooter>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <Typography
                    variant="body2"
                    textAlign="center"
                >
                    © 2022 por Ali Mohamed. - @alikhodr10
                </Typography>
                <StyledIconButton
                    aria-label="top"
                    size="small"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <NorthIcon fontSize="inherit" />
                </StyledIconButton>
            </Container>
        </StyledFooter>
    );
};

export default Footer;