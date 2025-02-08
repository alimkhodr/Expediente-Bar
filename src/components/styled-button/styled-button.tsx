import { styled } from '@mui/system';
import { Button } from '@mui/material';
import theme from '../../assets/theme';

interface Props {
  bgColor: string;
}

const StyledButtonGreen = styled(Button)<Props>(({ bgColor, color }) => ({
  boxShadow: 'none',
  backgroundColor: bgColor,
  border: 'none',
  padding: '4px 12px',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: "background-color 0.5s ease, color 0.5s ease, letter-spacing 0.5s ease",
  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: 'none',
    letterSpacing: '1px',
  },
}));

export default StyledButtonGreen;
