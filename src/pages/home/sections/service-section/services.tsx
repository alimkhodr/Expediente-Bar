import { Card, CardActionArea, CardContent, CardMedia, Container, Grid, styled, Typography } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import services from '../../../../assets/data/services-data';
import StyledButton from '../../../../components/styled-button/styled-button';

const Gallery = () => {
  const StyledGallery = styled('div')(({ theme }) => ({
    padding: '40px 0px',
    backgroundColor: theme.palette.background.paper,
  }));

  const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    transition: "transform 0.4s ease",
    "&:hover": {
      transform: 'scale(1.01)',
    },
  }));

  return (
    <StyledGallery>
      <Container>
        <Grid container spacing={3} justifyContent="center">
        {services.map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
          <StyledCard>
            <CardActionArea>
              <CardMedia
                component="img"
                height="180"
                image={item.img}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h4" fontWeight={700} color='primary'>
                  {item.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'primary' }}>
                  {item.text}
                </Typography>
                <StyledButton
                  variant="contained"
                  startIcon={<item.buttonICon />}
                  sx={{ mt: 1 }}
                  bgColor={item.buttonColor}
                  href={item.link}
                >
                  {item.buttonText}
                </StyledButton>
              </CardContent>
            </CardActionArea>
          </StyledCard>
          </Grid>
        ))}
        </Grid>
      </Container>
    </StyledGallery>
  );
};

export default Gallery;