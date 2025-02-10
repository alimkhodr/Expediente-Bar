import NavBar from "../../components/nav-bar/nav-bar"
import Slide from "./sections/slide-section/slide";
import Services from "./sections/service-section/services";
// import Products from "./sections/products-section/products";
// import Gallery from "./sections/gallery-section/gallery-section";
// import Form from "./sections/form-section/form";
// import Contact from "./sections/contact-section/contact";
import Footer from "./sections/footer-section/footer";
import FixedWhatsappButton from "../../components/fixed-whatsapp-button";
import Gallery from "./sections/gallery-section/gallery-section";


const Home = () => {
    return (
        <>
            <NavBar />
            <div id="home">
                <Slide />
            </div>
            <div id="servicos">
                <Services />
            </div>
            <div id="fotos">
                <Gallery />
            </div>
            {/* 
            <div id="reserva">
                <Form />
            </div>
            <div id="contato">
                <Contact />
            </div>
            <div id="address">
                <Contact />
            </div> */}
            <FixedWhatsappButton />
            <div id="footer">
                <Footer />
            </div>
        </>
    )
}

export default Home
