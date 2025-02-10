import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../../../assets/theme';
import slides from '../../../../assets/data/slides-data';
import StyledButton from '../../../../components/styled-button/styled-button';

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
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 0px 20px 20px rgba(0, 0, 0, 0.3)',
                maxWidth: { xs: '80%', sm: '50%' },
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                  color="primary"
                >
                  {slide.title}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                component="div"
                dangerouslySetInnerHTML={{ __html: slide.text }}
                sx={{
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
              <StyledButton
                variant="contained"
                startIcon={<slide.buttonIcon />}
                sx={{ mt: 1 }}
                bgColor={theme.palette.primary.main}
              >
                {slide.buttonText}
              </StyledButton>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </SwiperContainer>
  );
};

export default Slide;
