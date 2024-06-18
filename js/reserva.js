document.getElementById('btn-reservar').addEventListener('click', function(event) {
  event.preventDefault();
  
  var inputNome = document.getElementById('text_nome').value;
  var inputEvento = document.getElementById('text_evento').value;
  var inputQtd = document.getElementById('text_qtd').value;
  var inputData = document.getElementById('text_data').value;
  var inputHora = document.getElementById('text_hora').value;
  var inputObs = document.getElementById('text_obs').value;
  
  var currentDate = new Date();
  var selectedDate = new Date(inputData + 'T' + inputHora);
  
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
  
  var data = {
    nome: inputNome,
    evento: inputEvento,
    quantidade: inputQtd,
    data: inputData,
    hora: inputHora,
    observacao: inputObs
  };
  
  fetch('/.netlify/functions/send-reservation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.text())
  .then(data => {
    alert(data);
  })
  .catch(error => {
    console.error('Erro:', error);
  });
});