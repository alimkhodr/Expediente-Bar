import { Typography } from "@mui/material"
import FixedWhatsappButton from "../../components/fixed-whatsapp-button"
import NavBar from "../../components/nav-bar/nav-bar"
import Footer from "../home/sections/footer-section/footer"

const Cardapio = () => {
    return (
        <>
            <NavBar />
            <Typography>
                Cardápio aqui!
            </Typography>
            <FixedWhatsappButton />
            <div id="footer">
                <Footer />
            </div>
        </>
    )
}

export default Cardapio
