import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Typography, Container, styled, Button, Box } from '@mui/material';
import theme from '../../../../assets/theme';
import { WhatsApp } from '@mui/icons-material';
import StyledButtonGreen from "../../../../components/styled-button/styled-button-green";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import services from '../../../../assets/data/services-data';
import ServiceModal from './service-modal';

const StyledServices = styled('div')(({ theme }) => ({
  padding: '40px 0px',
  backgroundColor: theme.palette.primary.main,
}));

const StyledCard = styled('div')(() => ({
  marginBottom: '40px',
  borderRadius: 5,
  border: 'none',
  padding: 25,
  display: 'flex',
  gap: 8,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  backgroundColor: theme.palette.background.default,
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: '300px',
}));

const SwiperContainer = styled(Box)(() => ({
  '.swiper-button-next:after': {
    display: 'none',
  },
  '.swiper-button-prev:after': {
    display: 'none',
  },
  '.swiper-pagination-bullet': {
    background: theme.palette.background.default,
  },
}));

const Service = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    img: string;
    items: {
      category: string;
      service: { text: string; price: string }[];
    }[];
  } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const memoizedServices = services;

  const handleOpenModal = (service: {
    title: string;
    img: string;
    items: {
      category: string;
      service: { text: string; price: string }[];
    }[];
  }) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  return (
    <StyledServices>
      <Container>
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight="bold"
          color={'background.default'}
        >
          Serviços e preços
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color={'background.default'}
        >
          Nossos serviços disponíveis
        </Typography>

        <SwiperContainer sx={{ mt: 4 }}>
          <Swiper
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            initialSlide={currentSlide}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={25}
            slidesPerView={1}
            navigation
            autoplay={{ delay: 8000 }}
            loop={true}
            pagination={{ clickable: true }}
            breakpoints={{
              400: {
                slidesPerView: 1,
              },
              700: {
                slidesPerView: 2,
              },
              1000: {
                slidesPerView: 3,
              },
            }}
          >
            {memoizedServices.map((service, index) => (
              <SwiperSlide key={index} style={{ display: 'flex', justifyContent: 'center' }}>
                <StyledCard>
                  <img
                    src={service.img}
                    alt={service.title}
                    style={{ width: '100%', borderRadius: 5, height: '180px', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={theme.palette.primary.main}
                  >
                    {service.title}
                  </Typography>
                  {service.items.slice(0, 1).map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '8px' }}>
                      {item.service.slice(0, 4).map((svc, svcIdx) => (
                        <Typography
                          key={svcIdx}
                          variant="body2"
                          fontWeight="normal"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '290px',
                          }}
                        >
                          {svc.text} - R$ {svc.price}
                        </Typography>
                      ))}
                      <Button
                        sx={{ textTransform: 'none', padding: '3px 0px' }}
                        onClick={() => handleOpenModal(service)}
                      >
                        VER MAIS
                      </Button>
                    </div>
                  ))}
                  <StyledButtonGreen
                    startIcon={<WhatsApp />}
                    onClick={() => window.open(`https://wa.me/5512996119002?text=Ol%C3%A1!%0AGostaria%20de%20agendar%20uma%20sessão%20de%20*${service.title}*.`, '_blank')}
                  >
                    Agendar
                  </StyledButtonGreen>
                </StyledCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </SwiperContainer>
      </Container>

      {selectedService && (
        <ServiceModal
          open={modalOpen}
          handleClose={handleCloseModal}
          keepMounted
          title={selectedService.title}
          item={selectedService.items
            .map(
              (item) =>
                `${item.category == '' ? '' : `${item.category}\n`}
                ${item.service.map((svc) => `${svc.text} - R$ ${svc.price}`).join('\n')}`
            ).join('\n\n')}
        />
      )}
    </StyledServices>
  );
};

export default Service;