window.onload = function() {
  const input = document.getElementById("datanascimento");
  const hoje = new Date(); 

  const maxDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1).toISOString().split("T")[0];

  input.setAttribute("max", maxDate);

    exibirDados();
}

function limpa_formulário_cep() {
  document.getElementById('endereco').value=("");
  document.getElementById('bairro').value=("");
  document.getElementById('cidade').value=("");
  document.getElementById('uf').value=("");
}


function meu_callback(conteudo) {
if (!("erro" in conteudo)) {
  document.getElementById('endereco').value=(conteudo.logradouro);
  document.getElementById('bairro').value=(conteudo.bairro);
  document.getElementById('cidade').value=(conteudo.localidade);
  document.getElementById('uf').value=(conteudo.uf);
} 
else {
  
  limpa_formulário_cep();
  alert("CEP não encontrado.");
}
}

function pesquisacep(valor) {

var cep = valor.replace(/\D/g, '');


if (cep != "") {

  var validacep = /^[0-9]{8}$/;

  if(validacep.test(cep)) {
      var script = document.createElement('script');
      script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';
      document.body.appendChild(script);

  } 
  else {
      
      limpa_formulário_cep();
      alert("Formato de CEP inválido.");
  }
} 
else {
  limpa_formulário_cep();
}
};


var db = openDatabase('ficha', '1.0', 'Ficha Cadastral 1', 2 * 1024 * 1024);
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS fichacadastral (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, sobrenome TEXT, rg TEXT, cpf TEXT, cep TEXT, endereco TEXT, numero TEXT, complemento TEXT, bairro TEXT, cidade TEXT, uf TEXT, sexo TEXT, datanascimento TEXT, situacaocivil TEXT)');
});


function inserirDados() {
  var nome = document.getElementById("nome").value;
  var sobrenome = document.getElementById("sobrenome").value;
  var rg = document.getElementById("rg").value;
  var cpf = document.getElementById("cpf").value;
  var cep = document.getElementById("cep").value;
  var endereco = document.getElementById("endereco").value;
  var complemento = document.getElementById("complemento").value;
  var numero = document.getElementById("numero").value;
  var bairro = document.getElementById("bairro").value;
  var cidade = document.getElementById("cidade").value;
  var uf = document.getElementById("uf").value;
  var sexo = document.getElementById("sexo").value;
  var datanascimento = document.getElementById("datanascimento").value;
  var situacaocivil = document.querySelector('input[name="situacaocivil"]:checked').value;

  var db = openDatabase("ficha", "1.0", "Ficha Cadastral 1", 2 * 1024 * 1024);

  db.transaction(function (tx) {
    tx.executeSql(
      "INSERT INTO fichacadastral (nome, sobrenome, rg, cpf, cep, endereco, numero, complemento, bairro, cidade, uf, sexo, datanascimento, situacaocivil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nome, sobrenome, rg, cpf, cep, endereco, numero, complemento, bairro, cidade, uf, sexo, datanascimento, situacaocivil],
     
    );
  });
}

function exibirDados() {
  var db = openDatabase("ficha", "1.0", "Ficha Cadastral 1", 2 * 1024 * 1024);

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM fichacadastral",
      [],
      function (tx, resultado) {
        var tabela = document.getElementById("tabela-dados");

        for (var i = 0; i < resultado.rows.length; i++) {
          var row = resultado.rows.item(i);

          var tr = document.createElement("tr");
          var tdNome = document.createElement("td");
          var tdSobrenome = document.createElement("td");
          var tdRG = document.createElement("td");
          var tdCPF = document.createElement("td");
          var tdCEP = document.createElement("td");
          var tdEndereco = document.createElement("td");
          var tdNumero = document.createElement("td");
          var tdComplemento = document.createElement("td");
          var tdBairro = document.createElement("td");
          var tdCidade = document.createElement("td");
          var tdUF = document.createElement("td");
          var tdSexo = document.createElement("td");
          var tdDataNascimento = document.createElement("td");
          var tdSituacaoCivil = document.createElement("td");

          tdNome.innerText = row.nome;
          tdSobrenome.innerText = row.sobrenome;
          tdRG.innerText = row.rg;
          tdCPF.innerText = row.cpf;
          tdCEP.innerText = row.cep;
          tdEndereco.innerText = row.endereco;
          tdNumero.innerText = row.numero;
          tdComplemento.innerText = row.complemento;
          tdBairro.innerText = row.bairro;
          tdCidade.innerText = row.cidade;
          tdUF.innerText = row.uf;
          tdSexo.innerText = row.sexo;
          tdDataNascimento.innerText = row.datanascimento;
          tdSituacaoCivil.innerText = row.situacaocivil;

          tr.appendChild(tdNome);
          tr.appendChild(tdSobrenome);
          tr.appendChild(tdRG);
          tr.appendChild(tdCPF);
          tr.appendChild(tdCEP);
          tr.appendChild(tdEndereco);
          tr.appendChild(tdNumero);
          tr.appendChild(tdComplemento);
          tr.appendChild(tdBairro);
          tr.appendChild(tdCidade);
          tr.appendChild(tdUF);
          tr.appendChild(tdSexo);
          tr.appendChild(tdDataNascimento);
          tr.appendChild(tdSituacaoCivil);

          tabela.appendChild(tr);
        }
      },
      function (tx, erro) {
        alert("Erro ao exibir os dados: " + erro.message);
      }
    );
  });
}


function formatarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "");
  
  if (validarCPF(cpf)) {
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    alert("CPF inválido!");
  }

  return cpf;
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf === '') return false;

  if (
    cpf.length !== 11 ||
    cpf === "00000000000" ||
    cpf === "11111111111" ||
    cpf === "22222222222" ||
    cpf === "33333333333" ||
    cpf === "44444444444" ||
    cpf === "55555555555" ||
    cpf === "66666666666" ||
    cpf === "77777777777" ||
    cpf === "88888888888" ||
    cpf === "99999999999"
  ) {
    return false;
  }

  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;

  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;

  return true;
}

