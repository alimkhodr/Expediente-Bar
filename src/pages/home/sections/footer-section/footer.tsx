import { Container, IconButton, styled, Typography } from '@mui/material';
import NorthIcon from '@mui/icons-material/North';

const Footer = () => {
    const StyledFooter = styled('div')(({ theme }) => ({
        padding: '40px 0px',
        backgroundColor: theme.palette.primary.main,
    }));

    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
        transition: "transform 0.3s ease",
        "&:hover": {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.primary.main,
            transform: 'scale(1.04)',
        },
    }));


    return (
        <StyledFooter>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <Typography
                    variant="body2"
                    textAlign="center"
                    color={'background.default'}
                >
                    © 2025 por Ali Mohamed. - @alikhodr10
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