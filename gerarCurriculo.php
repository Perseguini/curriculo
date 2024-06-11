<?php


if($_FILES['foto']['size'] > 0){
   
    $conteudo = file_get_contents($_FILES['foto']['tmp_name']);
    
   
    $tipo = pathinfo($_FILES['foto']['tmp_name'], PATHINFO_EXTENSION);
    
    
    $foto = 'data:image/' . $tipo . ';base64,' . base64_encode($conteudo);
} else {
   
    $foto = "img/avatar-1.png";
}

$dados = array(
    'foto' => $foto,
    'nome' => $_POST['nome'],
    'data' => $_POST['data'],
    'endereco' => $_POST['endereco'],
    'telefone' => $_POST['telefone'],
    'email' => $_POST['email'],
    'objetivo' => $_POST['objetivo'],
    'formacoes' => isset($_POST['formacao-curso']) ?
                   array(
                        'cursos' => $_POST['formacao-curso'],
                        'instituicoes' => $_POST['formacao-instituicao'],
                        'conclusoes' => $_POST['formacao-conclusao']
                    ) : null, //
    'experiencias' => isset($_POST['experiencia-cargo']) ? 
                      array(
                        'cargos' => $_POST['experiencia-cargo'],
                        'empresas' => $_POST['experiencia-empresa'],
                        'inicios' =>  $_POST['experiencia-inicio'],
                        'fins' =>  $_POST['experiencia-fim'],
                      ) : null //
);

require_once("modelo.php");