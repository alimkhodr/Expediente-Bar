import { styled } from '@mui/system';
import { Button } from '@mui/material';
import theme from '../../assets/theme';

const StyledButtonGreen = styled(Button)(() => ({
  boxShadow: 'none',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: `1px solid ${theme.palette.primary.main}`,
  padding: '4px 12px',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: "background-color 0.8s ease, color 0.8s ease",
  "&:hover": {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: theme.palette.primary.main,
  },
}));

export default StyledButtonGreen;
