import batucada from "./../images/batucada.webp"
import clientes from "./../images/clientes.webp"
import contra from "./../images/contra-com-fritras.webp"
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';

const slides = [
  {
    img: batucada,
    title: 'Música ao vivo',
    text: 'Aqui a música ganha vida! Desfrute de noites inesquecíveis com nossa seleção variada de música ao vivo, incluindo sertanejo, pop, MPB e nosso imperdível pagode de sábado, que é a grande estrela da casa. Venha curtir a vibe e mergulhar na melhor experiência musical da cidade!',
    buttonText: 'Confira a Agenda',
    buttonIcon: InsertInvitationIcon,
    link: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTUzMDEwNTMxODIwMzIy?story_media_id=3546119687538354153_48396422607&igsh=MW9hbzJ3bHdqem5lag==',
  },
  {
    img: clientes,
    title: 'Garanta seu lugar agora!',
    text: 'Não perca tempo! Faça sua reserva agora mesmo e garanta seu lugar. Clique no botão abaixo para enviar sua mensagem diretamente para o nosso WhatsApp.',
    buttonText: 'Faça Uma Reserva',
    buttonIcon: WhatsAppIcon,
    link: 'https://wa.me/5512988865185?text=Olá!',
  },
  {
    img: contra,
    title: 'Saboreie o Melhor por Menos!',
    text: 'Descubra por que somos a escolha perfeita: oferecemos pratos deliciosos e bebidas refrescantes, tudo com a qualidade que você merece, a um preço que cabe no seu bolso. Explore nosso cardápio agora!',
    buttonText: 'Confira o Cardápio',
    buttonIcon: MenuBookIcon,
    link: '/cardapio',
  },
];

export default slides;