import { useEffect, useState, useRef } from 'react';
import { Container, styled, Typography, Grid, Pagination, Link, useMediaQuery, useTheme } from '@mui/material';
import ProductCard from './products-card';
import axios from 'axios';

interface Props {
  id: string;
  name: string;
  price: number;
  images: { imageUrl: string }[];
  code: string;
  slugName: string;
  isBundle: boolean;
  isNew: boolean;
  isPopular: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Props[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const productsPerPage = isDesktop ? 8 : 6;

  const topRef = useRef<HTMLDivElement | null>(null);

  const StyledProducts = styled('div')(({ theme }) => ({
    padding: '40px 0px',
    backgroundColor: theme.palette.background.paper,
  }));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const urls = [
          'https://dv9547x9lh.execute-api.us-east-2.amazonaws.com/product/api/v2/Product/ListV2?CategoryId=2BF65B5E-60D3-EB11-A315-005056010963&PageSize=10',
          'https://dv9547x9lh.execute-api.us-east-2.amazonaws.com/product/api/v2/Product/ListV2?CategoryId=8694D27C-8EAE-EF11-84F8-02F716A02C8F&PageSize=10',
          'https://dv9547x9lh.execute-api.us-east-2.amazonaws.com/product/api/v2/Product/ListV2?CategoryId=5FA5617D-8FAE-EF11-84F8-02F716A02C8F&PageSize=10',
          'https://dv9547x9lh.execute-api.us-east-2.amazonaws.com/product/api/v2/Product/ListV2?CategoryId=5AECB19A-63D3-EB11-A315-005056010963&PageSize=10',
        ];

        const responses = await Promise.all(urls.map(url => axios.get(url)));
        const allProducts = responses
          .map(response => response.data.Data.products)
          .flat();

        const uniqueProductsMap = new Map<string, Props>();
        allProducts.forEach(product => {
          if (!uniqueProductsMap.has(product.id)) {
            uniqueProductsMap.set(product.id, product);
          }
        });
        setProducts(Array.from(uniqueProductsMap.values()));
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <StyledProducts>
      <div ref={topRef}>
        <Container>
          <Typography variant="h3" textAlign="center" fontWeight="bold">
            Produtos
          </Typography>
          <Typography variant="body1" textAlign="center">
            Em parceria com&nbsp;
            <Link href="https://farmasi.com.br/paonblanccosmeticos" underline="always">
              {'Farmasi'}
            </Link>
          </Typography>
        </Container>
      </div>
      <Container>
        <Grid container spacing={2} justifyContent="center" mt={3}>
          {displayedProducts.map(product => (
            <Grid
              item
              key={product.id}
              xs={6}
              sm={4}
              md={3}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <ProductCard
                image={product.images[0]?.imageUrl || ''}
                product={product.name}
                price={product.price.toFixed(2).replace('.', ',')}
                url={`https://farmasi.com.br/paonblanccosmeticos/product-detail/${product.slugName}?pid=${product.code}`}
                type={product.isBundle ? 'Pacote' : product.isNew ? 'Novo' : product.isPopular ? 'Popular' : ''}
              />
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={Math.ceil(products.length / productsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
        />
      </Container>
    </StyledProducts>
  );
};

export default Products;