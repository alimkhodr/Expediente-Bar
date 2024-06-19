function validarDataHora() {
    var inputNome = encodeURIComponent(document.getElementById('text_nome').value);
    var inputEvento = encodeURIComponent(document.getElementById('text_evento').value);
    var inputQtd = encodeURIComponent(document.getElementById('text_qtd').value);
    var inputHora = document.getElementById('text_hora').value;
    var inputObs = encodeURIComponent(document.getElementById('text_obs').value);
  
    var inputData = document.getElementById('text_data').value;
    var [ano, mes, dia] = inputData.split("-");
    var dataFormatada = dia + '/' + mes + '/' + ano;
  
    var currentDate = new Date(); // Data e hora atuais
    var selectedDate = new Date(inputData + 'T' + inputHora); // Data e hora selecionadas
  
    if (inputNome === "" || inputQtd === "" || inputData === "" || inputHora === "") {
      alert("Preencha todos os campos obrigatórios");
      return false;
    }
  
    if (selectedDate < currentDate) {
      alert("A data e hora não podem ser anteriores à data e hora atuais.");
      return false;
    }
  
    if (inputQtd < 2) {
      alert("Escolha uma quantidade maior que 1");
      return false;
    }
  
    if (inputQtd > 30) {
      alert("Escolha uma quantidade menor que 30 pessoas");
      return false;
    }
  
    var apiLink = "https://api.whatsapp.com/send?phone=+55+55%2012%2098886-5185&text=Olá, gostaria de fazer uma reserva%0A*Nome:*%20" + inputNome + "%0A*Evento:*%20" + inputEvento + "%0A*Quantidade:*%20" + inputQtd + "%20pessoas%0A*Data:*%20" + dataFormatada + "%0A*Horário:*%20" + inputHora + "%0A*Observação:*%20" + inputObs + "";
    document.getElementById('apiLink').href = apiLink;
  
    return true;
}
  
document.getElementById('apiLink').addEventListener('click', function (event) {
    if (validarDataHora()) {
        document.querySelector('form[name="reserva-form"]').submit(); // Envia o formulário via Netlify
    } else {
        event.preventDefault();
    }
});
