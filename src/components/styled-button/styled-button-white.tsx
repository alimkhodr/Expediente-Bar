import { styled } from '@mui/system';
import { Button } from '@mui/material';
import theme from '../../assets/theme';

const StyledButtonWhite = styled(Button)(() => ({
  boxShadow: 'none',
  backgroundColor: theme.palette.primary.contrastText,
  color: theme.palette.primary.main,
  border: 'none',
  padding: '4px 12px',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: "background-color 0.8s ease, border 0.8s ease, color 0.8s ease",
  "&:hover": {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: `1px solid ${theme.palette.primary.contrastText}`,
    color: theme.palette.primary.contrastText,
  },
}));

export default StyledButtonWhite;
