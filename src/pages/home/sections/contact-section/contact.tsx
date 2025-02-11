import { Box, Container, styled, Typography, Grid } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import theme from '../../../../assets/theme';
import ContactButton from '../../../../components/styled-button/contact-button';

const Contact = () => {
    const StyledContact = styled('div')(({ theme }) => ({
        padding: '40px 0px',
        background: theme.palette.background.default,
    }));

    return (
        <StyledContact>
            <Container>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Box sx={{ marginBottom: 2 }}>
                                <Typography variant="h3" fontWeight="bold">Entre em <span style={{ color: theme.palette.primary.main }}>Contato</span></Typography>
                                <Typography variant="body1">No caso de alguma duvida ou reservas mesas.</Typography>
                            </Box>
                            <ContactButton
                                icon={WhatsAppIcon}
                                color={theme.palette.background.default}
                                backgroundColor={theme.palette.primary.main}
                                link='https://wa.me/5512988865185?text=Olá!'
                                text='(12) 98886-5185'
                            />
                            <ContactButton
                                icon={InstagramIcon}
                                color={theme.palette.background.default}
                                backgroundColor={theme.palette.primary.main}
                                link='https://www.instagram.com/expedientebar_'
                                text='@expedientebar_'
                            />
                            <ContactButton
                                icon={FacebookIcon}
                                color={theme.palette.background.default}
                                backgroundColor={theme.palette.primary.main}
                                link='https://www.facebook.com/expedientebar_'
                                text='Expediente Bar'
                            />
                            <ContactButton
                                icon={MailOutlineIcon}
                                color={theme.palette.background.default}
                                backgroundColor={theme.palette.primary.main}
                                link='mailto:contatoexpediente@gmail.com'
                                text='contatoexpediente@gmail.com'
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7333.327207348863!2d-45.887348!3d-23.218927!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc4a8c55544269%3A0xa891d1d896845d41!2sR.%20Paulo%20da%20Silva%20Santos%2C%2032%20-%20Floradas%20de%20S%C3%A3o%20Jos%C3%A9%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Campos%20-%20SP%2C%2012230-091!5e0!3m2!1spt-BR!2sbr!4v1739294099875!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="300"
                            style={{ border: 0, borderRadius: 5 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen={true}
                        />
                    </Grid>
                </Grid>
            </Container>
        </StyledContact>
    );
};

export default Contact;
