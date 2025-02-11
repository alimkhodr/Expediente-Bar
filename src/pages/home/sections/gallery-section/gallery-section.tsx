import { Box, Container, ImageList, ImageListItem, styled, Typography } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import images from '../../../../assets/data/gallery-data';
import { useMediaQuery } from '@mui/system';
import theme from '../../../../assets/theme';

const Gallery = () => {
  const StyledGallery = styled('div')(({ theme }) => ({
    padding: '40px 0px',
    backgroundColor: theme.palette.background.default,
  }));

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const galleryCols = isDesktop ? 3 : 2;

  return (
    <StyledGallery>
      <Container>
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight="bold"
          color={'text.primary'}
        >
          Fotos
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color={'text.primary'}
        >
          Momentos do nosso <span style={{ color: theme.palette.primary.main }}>Bar</span>
        </Typography>

        <Box sx={{ mt: 4 }}>
          <ImageList cols={galleryCols} gap={15}>
            {images.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  style={{ borderRadius: 5 }}
                  srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Container>
    </StyledGallery>
  );
};

export default Gallery;