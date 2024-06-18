const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const { nome, evento, quantidade, data, hora, observacao } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: 'Nova Reserva de Mesa',
    text: `
      Nome: ${nome}
      Evento: ${evento}
      Quantidade: ${quantidade} pessoas
      Data: ${data}
      Horário: ${hora}
      Observação: ${observacao}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: 'Reserva enviada com sucesso'
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Erro ao enviar e-mail: ' + error.message
    };
  }
};
