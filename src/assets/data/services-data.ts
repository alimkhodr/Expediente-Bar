import chegaJunto from "./../images/chega-junto.webp"
import drink from "./../images/drink.webp"
import contra from "./../images/contra-com-fritras.webp"
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

const services = [
  {
    img: chegaJunto,
    title: 'Música ao vivo',
    text: 'O melhor pagode da cidade no sábado e na sexta ou feriados temos música ao vivo como sertanejo, MPB, Brasilidades e muito mais. Veja nossa agenda',
    buttonText: 'Agenda',
    buttonColor: 'primary',
    buttonICon: InsertInvitationIcon,
    link: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTUzMDEwNTMxODIwMzIy?story_media_id=3546119687538354153_48396422607&igsh=MW9hbzJ3bHdqem5lag==',
  },
  {
    img: contra,
    title: 'Porções Maravilhosas',
    text: 'Porções feitas com ingredientes selecionados da melhor qualidade. Disponível no Ifood',
    buttonText: 'Ifood',
    buttonColor: 'red',
    buttonICon: DeliveryDiningIcon,
    link: 'https://www.ifood.com.br/delivery/sao-jose-dos-campos-sp/expediente-bar-jardim-satelite/0780226c-3ae2-4204-b6f0-ed90ada79fc2',
  },
  {
    img: drink,
    title: 'Drinks Deliciosos',
    text: 'Drinks sensacionais feito com ingredientes da melhor qualidade. Veja nosso caradápio.',
    buttonText: 'Cardápio',
    buttonColor: 'primary',
    buttonICon: MenuBookIcon,
    link: '/cardapio',
  },
];

export default services;