import NavBar from "../../components/nav-bar/nav-bar"
import Slide from "./sections/slide-section/slide";
// import Services from "./sections/service-section/services";
// import Products from "./sections/products-section/products";
// import Gallery from "./sections/gallery-section/gallery-section";
// import Form from "./sections/form-section/form";
// import Contact from "./sections/contact-section/contact";
import Footer from "./sections/footer-section/footer";
import FixedWhatsappButton from "../../components/fixed-whatsapp-button";


const Home = () => {
    return (
        <>
            <NavBar />
            <div id="slide">
                <Slide />
            </div>
            {/* <div id="services">
                <Services />
            </div>
            <div id="products">
                <Products />
            </div>
            <div id="gallery">
                <Gallery />
            </div>
            <div id="contact">
                <Form />
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
