import { Fab, Typography } from "@mui/material"
import Footer from "../home/sections/footer-section/footer"
import { Container } from "@mui/system"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Cardapio = () => {
    return (
        <>
            <Fab
                size="small"
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
            <div style={{
                minHeight: '100vh',
            }}>
                <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0 }}
                    src="https://www.canva.com/design/DAGbdhINMFk/Ha0j9By6XjF-umx0_ucFAA/view?embed" allowFullScreen allow="fullscreen">
                </iframe>
            </div>
            <Footer />
        </>
    )
}

export default Cardapio
