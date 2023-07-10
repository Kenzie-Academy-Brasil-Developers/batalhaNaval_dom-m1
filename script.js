
let guesses = []; //Array utilizado para armazenamento dos movimentos
let shipPositions = []; //Array que armazena as posições dos navios inimigos
let jogadas = 0; //Contagem de jogadas
let acertos = 0;

const board = document.querySelector('#board .tabuleiro'); //Referência do tabuleiro

//Função responsável por iniciar o jogo;
function startGame(){ 
    createSeaBoard(board);
    shipPositions = allocateShips(); 
}

// Função que cria o boar inicial do jogo;
function createSeaBoard(board){
    for(let i = 0 ; i<5 ; i++){
        for(let j = 0 ; j<5 ; j++){
            let li = document.createElement('li');
            li.classList.add('posicao');
            li.setAttribute('i',i);
            li.setAttribute('j',j);
            li.addEventListener('click', eventClick_explode)
            board.appendChild(li);
        }
    }
}

// Função que tem por objetivo randomizar as posições dos navios inimigos;
function allocateShips(){
    let positions = [];

    for(let cont = 0; cont<5 ; cont++){
        let isDiferent = false;
        let i = parseInt(Math.random() * 5);
        let j = parseInt(Math.random() * 5);
        while(!isDiferent){
            if(verifyOccurence(positions,i,j) == false){
                isDiferent = true;
                positions.push([i,j]);
            }
            i = parseInt(Math.random() * 5);
            j = parseInt(Math.random() * 5);
        }
    }
    return positions;
}

// Função que será chamada durante o click nos botões do board;
function eventClick_explode(e){
    const li = e.target;
    const x = li.getAttribute('i');
    const y = li.getAttribute('j');

    li.innerText = 'X'
    if(verifyOccurence(shipPositions, x,y)){
        li.style.background = 'green';
        acertos++;
    }else{
        li.style.background = 'red';
    }
    guesses.push([x,y]);
    updateCount();
    updateChance()
    checkWinCondition();
}

// Função utilizada para verificar se determida cordenada i,j está contida dentro de um array de posições;
function verifyOccurence(arr, i,j){
    let flag = false;
    for(let count = 0; count<arr.length ; count++){
        if(arr[count][0] == i && arr[count][1] == j){
            flag = true;
        } 
    }
    return flag;
}

// Função que irá verificar se o usuário venceu a partida;
function checkWinCondition(){
    let count = 0;
   
    // Percorre o array de palpites e verifica se suas coordenadas se encontram no array de posições dos navios
    for(let i = 0 ; i<guesses.length; i++){
        
        for(let j = 0; j<shipPositions.length ; j++){
            if(shipPositions[j][0] == guesses[i][0] && shipPositions[j][1] == guesses[i][1]){
                count++; 
            }
        }
        // Forma alternativa, utilizando a função verifyOccurence
        // if(verifyOccurence(shipPositions, guesses[i][0], guesses[i][1])){
        //     count++;
        // }
    }

    if(count >= 5){
        let result = confirm(`O jogador venceu em ${jogadas} jogadas, deseja reiniciar?`);
        if(result){
            window.location.reload(true);
        }
    }
}

// Função utilizada para atualizar o contador de rodadas;
function updateCount(){
    jogadas++;
    document.querySelector('#count').innerHTML = jogadas;
}

// Função utilizada para atualizar o contador de rodadas;
function updateChance(){
    const jogadasRestantes = 25 - jogadas;
    const pontosRestantes = 5 - acertos;
    const acc = pontosRestantes / jogadasRestantes;
    document.querySelector('#acc').innerHTML = (acc*100).toFixed(2)+"%";
}

