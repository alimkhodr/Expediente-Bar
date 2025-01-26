import { Fab } from "@mui/material"
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const FixedWhatsappButton = () => {
    const number = '5512996119002';
    
    return (
        <div style={{ position: 'sticky', bottom: 0, zIndex: 2 }}>
            <Fab
                color="primary"
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    backgroundColor: "#2ba048"
                }}
                onClick={() => window.open(`https://wa.me/${number}?text=Olá!`, '_blank')}
            >
                <WhatsAppIcon sx={{ color: "background.default" }} />
            </Fab>
        </div>
    );
};

export default FixedWhatsappButton;
