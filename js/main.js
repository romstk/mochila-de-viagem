const form = document.getElementById("novoItem");
const lista = document.getElementById("lista");
/*
Array que será usado para adicionar os itens que forem sendo adicionados a lista e este array vai sendo saldo no localstorage do navegador. 
Se localstorage não existir cria um array vazio, senão carrega os itens,
Estes dados estão salvos no localStorage em string, então temos que parsear a string para transformar em um array
*/
const itens = JSON.parse(localStorage.getItem("itens")) || []; 


itens.forEach(elemento => {
    criaElemento(elemento)
});


form.addEventListener("submit", (evento)=> {
    //Cancela o evento se for cancelável, sem parar a propagação do mesmo.
    evento.preventDefault(); 

    const nome = evento.target.elements['nome'];
    const quantidade  = evento.target.elements['quantidade'];  

    const itemAtual =  {
        "nome": nome.value,
        "quantidade" : quantidade.value
    }

    const itemExiste = itens.find(elemento => elemento.nome === nome.value);
    //Testa se o elemento a ser incluído existe gravado, se não existir inclui, senão atualiza
    if(itemExiste){
        itemAtual.id = itemExiste.id;
        atualizaElemento(itemAtual); 
        //Atualiza o array na posição que o item está gravado
        itens[itens.findIndex(elemento => elemento.id === itemExiste.id)] = itemAtual;
        
    }else {
        //SE o tamanho do array for zero atribui id = 0, senão calcula o id conformne for inserindo os itens
        itemAtual.id = itens[itens.length - 1] ? (itens[itens.length - 1]).id +1 : 0;
        criaElemento(itemAtual);
        itens.push(itemAtual);
    
    }

    
    //Função stringify converte os dados contidos em formato de array para string em formado para gravar no localstorage o array no formato que o navegador aceita(string). 
    localStorage.setItem("itens", JSON.stringify(itens));

    nome.value = "";
    quantidade.value = "";


});


function criaElemento(itemAtual) {
    //Cria um novo elemento em formato de TAG HTML li para receber o novo item de lista 
    const novoItem = document.createElement('li');
    //Adiciona ao item a classe a que ele deve pertencer
    novoItem.classList.add("item"); 
    //Cria o objeto strong que recebe a quantidade
    const numeroItem = document.createElement('strong');
    numeroItem.innerHTML = itemAtual.quantidade;
    //Adiciona ao novo <li> o strong contendo a quantidade adicionada
    numeroItem.dataset.id = itemAtual.id;
    novoItem.appendChild(numeroItem);
    //Adiciona ao texto da li o texto da variável nome
    novoItem.innerHTML += itemAtual.nome
    novoItem.appendChild(botaoDeleta(itemAtual.id));
    lista.appendChild(novoItem);


}

function atualizaElemento(itemAtual){
    document.querySelector("[data-id='"+itemAtual.id+"']").innerHTML = itemAtual.quantidade;
}

function botaoDeleta(id){
    const elementoBotao = document.createElement("button");
    elementoBotao.innerText = "x"; 

    elementoBotao.addEventListener("click", function(){
        //Passa como parâmetro para a função o PAI do elemento clicado
        deletaElemento(this.parentNode, id);
    });
    return elementoBotao;
}

function deletaElemento(elemento, id){
    elemento.remove();
    console.log(id);

    //Remove o item do array conforme o id passado como parametro
    itens.splice(itens.find(elemento => elemento.id === id), 1);
    localStorage.setItem("itens", JSON.stringify(itens));

}