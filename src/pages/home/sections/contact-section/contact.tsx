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
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d229.17333992172425!2d-45.908833018473416!3d-23.21492590240116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc35ab7fcf9253%3A0x5b698e4f060e2154!2sPromovere%20Vita%20-%20Coworking!5e0!3m2!1spt-BR!2sbr!4v1736117182280!5m2!1spt-BR!2sbr"
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
