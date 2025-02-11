import { Fab, Typography } from "@mui/material"
import Footer from "../home/sections/footer-section/footer"
import { Container } from "@mui/system"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Cardapio = () => {
    return (
        <>
            <Fab
                color="primary"
                sx={{
                    position: 'fixed',
                    top: 20,
                    left: 20,
                }}
                onClick={() => window.location.href = '/'}
            >
                <ArrowBackIcon sx={{ color: "background.default" }} />
            </Fab>
            <Container sx={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", height:1000}}>
                <Typography>
                    Cardápio aqui!
                </Typography>
            </Container>
            <div id="footer">
                <Footer />
            </div>
        </>
    )
}

export default Cardapio
