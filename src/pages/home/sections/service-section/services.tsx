import { Card, CardActionArea, CardContent, CardMedia, Container, Grid, styled, Typography } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import services from '../../../../assets/data/services-data';

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
      transform: 'scale(1.02)',
    },
  }));

  return (
    <StyledGallery>
      <Container>
        <Grid container spacing={3} justifyContent="center">
        {services.map((item) => (
          <Grid item xs={12} md={4}>
          <StyledCard key={item.title}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="180"
                image= {item.img}
                alt="green iguana"
              />
              <CardContent>
                <Typography variant="h4" fontWeight={700} color='primary'>
                  {item.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'primary' }}>
                  {item.text}
                </Typography>
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