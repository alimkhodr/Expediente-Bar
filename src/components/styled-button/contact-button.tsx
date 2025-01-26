import { Button } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface Props {
    icon: SvgIconComponent;
    color: string;
    backgroundColor: string;
    link: string;
    text: string;
}

const ContactButton: React.FC<Props> = ({ icon: Icon, color, backgroundColor, link, text }) => {
    return (
        <Button
            size="large"
            startIcon={<Icon sx={{ color: color, backgroundColor: backgroundColor, padding: "3px", borderRadius: 1 }} />}
            sx={{ padding: '0 5px', textTransform: 'none' }}
            onClick={() => window.open(`${link}`, '_blank')}
        >
            {text}
        </Button>
    );
};

export default ContactButton;
