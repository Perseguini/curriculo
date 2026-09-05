$(function () {

    function lerFotoComoBase64(arquivo) {
        return new Promise(function (resolve, reject) {
            if (!arquivo) {
                resolve("img/avatar-1.png");
                return;
            }
            var leitor = new FileReader();
            leitor.onload = function () {
                resolve(leitor.result);
            };
            leitor.onerror = function () {
                reject(new Error("Não foi possível ler a foto enviada."));
            };
            leitor.readAsDataURL(arquivo);
        });
    }

    function coletarLista(seletorLinha, camposMap) {
        // camposMap: { chaveNoResultado: name do input (sem colchetes) }
        var resultado = {};
        Object.keys(camposMap).forEach(function (chave) {
            resultado[chave] = [];
        });

        var linhas = $(seletorLinha);
        var temAlgumaLinhaPreenchida = false;

        linhas.each(function () {
            var linha = $(this);
            var valores = {};
            var linhaTemConteudo = false;

            Object.keys(camposMap).forEach(function (chave) {
                var nomeCampo = camposMap[chave];
                var valor = linha.find('[name="' + nomeCampo + '[]"]').val() || "";
                valores[chave] = valor;
                if (valor.trim() !== "") {
                    linhaTemConteudo = true;
                }
            });

            if (linhaTemConteudo) {
                temAlgumaLinhaPreenchida = true;
                Object.keys(camposMap).forEach(function (chave) {
                    resultado[chave].push(valores[chave]);
                });
            }
        });

        return temAlgumaLinhaPreenchida ? resultado : null;
    }

    function mostrarErro(mensagem) {
        var $erro = $("#alerta-erro");
        $erro.text(mensagem).show();
        window.scrollTo(0, 0);
    }

    function esconderErro() {
        $("#alerta-erro").hide();
    }

    $("#form-curriculo").on("submit", function (e) {
        e.preventDefault();
        esconderErro();

        var nome = $("#nome").val().trim();
        var email = $("#email").val().trim();

        if (!nome) {
            mostrarErro("Por favor, preencha o campo Nome antes de gerar o currículo.");
            $("#nome").focus();
            return;
        }

        var arquivoFoto = $("#foto")[0].files[0];

        lerFotoComoBase64(arquivoFoto).then(function (foto) {
            var dados = {
                foto: foto,
                nome: nome,
                data: $("#data").val().trim(),
                endereco: $("#endereco").val().trim(),
                telefone: $("#telefone").val().trim(),
                email: email,
                objetivo: $("#objetivo").val().trim(),
                formacoes: coletarLista("#div-formacoes .card", {
                    cursos: "formacao-curso",
                    instituicoes: "formacao-instituicao",
                    conclusoes: "formacao-conclusao"
                }),
                experiencias: coletarLista("#div-experiencias .card", {
                    cargos: "experiencia-cargo",
                    empresas: "experiencia-empresa",
                    inicios: "experiencia-inicio",
                    fins: "experiencia-fim"
                })
            };

            try {
                localStorage.setItem("dadosCurriculo", JSON.stringify(dados));
            } catch (erro) {
                mostrarErro("Não foi possível salvar os dados do currículo (armazenamento local indisponível ou foto muito grande). Tente uma foto menor.");
                return;
            }

            window.open("gerarCurriculo.html", "_blank");
        }).catch(function (erro) {
            mostrarErro(erro.message || "Ocorreu um erro ao processar a foto.");
        });
    });
});
