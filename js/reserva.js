function validarDataHora() {
  var inputNome = encodeURIComponent(document.getElementById('text_nome').value);
  var inputEvento = encodeURIComponent(document.getElementById('text_evento').value);
  var inputQtd = encodeURIComponent(document.getElementById('text_qtd').value);
  var inputData = document.getElementById('text_data').value;
  var inputHora = document.getElementById('text_hora').value;
  var inputObs = encodeURIComponent(document.getElementById('text_obs').value);

  var currentDate = new Date().toISOString().split('T')[0];
  var currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

  if (inputNome === "" || inputQtd === "" || inputData === "" || inputHora === "") {
    alert("Preencha todos os campos obrigatórios");
    return false;
}

  if (inputData < currentDate) {
      alert("A data não pode ser menor que a data atual.");
      return false;
  }

  if (inputQtd < 2) {
    alert("Escolha uma quantidade maior que 1");
    return false;
}

  if (inputData === currentDate && inputHora < currentTime) {
      alert("A hora não pode ser menor que a hora atual.");
      return false;
  }
  var apiLink = "https://api.whatsapp.com/send?phone=551298886-5185&text=%20*Nome:*%20" + inputNome + "%0A*Evento:*%20" + inputEvento + "%0A*Quantidade:*%20" + inputQtd + "%0A*Data:*%20" + inputData + "%0A*Horário:*%20" + inputHora + "%0A*Observação:*%20" + inputObs + "";
  document.getElementById('apiLink').href = apiLink;

  return true;
}

document.getElementById('apiLink').addEventListener('click', function (event) {
  if (!validarDataHora()) {
      event.preventDefault();
  }
});
