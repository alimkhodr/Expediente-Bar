import { Box, CardActions, CardContent, CardMedia, Chip, styled, Typography } from "@mui/material";
import StyledButtonGreen from "../../../../components/styled-button/styled-button";

interface Props {
  image: string;
  product: string;
  price: string;
  url: string;
  type: string;
}

const StyledCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  padding: '20px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 5,
  border: `1px solid #ccc`,
  transition: "transform 0.3s ease",
  width: '100%',
  maxWidth: 280,
  justifyContent: 'space-between',
  "&:hover": {
    transform: 'scale(1.03)',
  },
}));

const ProductCard: React.FC<Props> = ({ image, product, price, url, type }) => {
  return (
    <StyledCard>
      <Box sx={{ position: 'absolute'}}>
        <Chip
          size="small"
          label={type}
          sx={{
            backgroundColor: type === "Pacote" ? "#bec5da" : type === "Novo" ? "#2ba048" : type === "Popular" ? '#d6beda' : '',
            color: "white",
            borderRadius: 1,
            display: type === '' ? 'none' : 'flex'
          }}
        />
      </Box>
      <CardMedia
        sx={{ height: { xs: '150px', md: '250px' } }}
        image={image}
        title={product}
      />
      <CardContent sx={{ padding: 0 }}>
        <Typography variant="body2">
          {product}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          R$ {price}
        </Typography>
      </CardContent>
      <CardActions>
        <StyledButtonGreen
          sx={{ width: '100%', fontSize: '0.6rem' }}
          size="small"
          onClick={() => window.open(url, '_blank')}
        >
          Confira
        </StyledButtonGreen>
      </CardActions>
    </StyledCard>
  );
};

export default ProductCard;
