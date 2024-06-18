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

  return true;
}

// Evento de submit do formulário
document.querySelector('form[name="reserva-form"]').addEventListener('submit', function(event) {
  if (!validarDataHora()) {
    event.preventDefault(); // Impede o envio do formulário se a validação falhar
  }
});