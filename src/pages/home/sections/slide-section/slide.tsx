import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../../../assets/theme';
import slides from '../../../../assets/data/slides-data';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import StyledButtonGreen from '../../../../components/styled-button/styled-button-green';

const SwiperContainer = styled(Box)(({ theme }) => ({
  '.swiper-button-next:after': {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      color: theme.palette.primary.main,
      content: '"next"',
    },
  },
  '.swiper-button-prev:after': {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      color: theme.palette.primary.main,
      content: '"prev"',
    },
  },
  '.swiper-pagination-bullet': {
    background: theme.palette.primary.main,
  },
}));

const handleWhatsAppClick = (title: string, subtitle: string) => {
  const message = `Ol%C3%A1!%0AGostaria%20de%20agendar%20uma%20sess%C3%A3o%20do%20*${subtitle}*%20de%20*${title}*.`;
  window.open(`https://wa.me/5512996119002?text=${message}`, '_blank', 'noopener,noreferrer');
};

const Slide = () => {
  return (
    <SwiperContainer
      sx={{
        width: '100%',
        height: 'calc(95dvh)',
        position: 'relative',
      }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 8000 }}
        loop
        style={{ width: '100%', height: '100%' }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              src={slide.img}
              alt={slide.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1 }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                top: { xs: '40%', sm: '40%' },
                left: { xs: '5%', sm: '5%' },
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: 2,
                borderRadius: 2,
                gap: 1,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                  {slide.subtitle}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                component="div"
                dangerouslySetInnerHTML={{ __html: slide.text }}
                sx={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              />
              <StyledButtonGreen
                variant="contained"
                startIcon={<WhatsAppIcon />}
                sx={{ mt: 1 }}
                onClick={() => handleWhatsAppClick(slide.title, slide.subtitle)}
              >
                {slide.buttonText}
              </StyledButtonGreen>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </SwiperContainer>
  );
};

export default Slide;
