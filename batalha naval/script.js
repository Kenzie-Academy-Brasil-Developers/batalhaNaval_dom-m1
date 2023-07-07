const player = document.querySelector('#player');
const boardPlayer = document.querySelector('#player .tabuleiro');
let playerAllocated = [];
let playerMovements = [];

const cpu = document.querySelector('#cpu');
const boardCpu = document.querySelector('#cpu .tabuleiro');
let cpuAllocated = [];
let cpuMovements = [];

function createInitialBoard(board){
    document.querySelector('#btnStart').remove();
    for(let i = 0 ; i<5 ; i++){
        for(let j = 0 ; j<5 ; j++){
            let li = document.createElement('li');
            li.classList.add('posicao');
            li.setAttribute('i',i);
            li.setAttribute('j',j);
            li.addEventListener('click', eventClick_posicao)
            board.appendChild(li);
        }
    }
}

function eventClick_posicao(e){
    const li = e.target;
    if(playerAllocated.length < 5){
        li.style.background = 'green';
        playerAllocated.push([li.getAttribute('i'),li.getAttribute('j')]);
        if(playerAllocated.length == 5){
            document.querySelector('#allocatedOrientation').remove();
            createCPUBoard(boardCpu);
            let p = document.createElement('p');
            p.innerText = "Clique no board acima para enviar uma bomba";
            cpu.appendChild(p);
            cpuAllocated = allocateCPUShips();
        }
    }
}

function allocateShips(){
    createInitialBoard(boardPlayer);
    let orientation = document.createElement('p');
    orientation.innerText = "Marque no board acima a posição dos seus 5 navios!";
    orientation.id = 'allocatedOrientation';
    player.appendChild(orientation);
}

function createCPUBoard(board){
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

function cpuMovement(){
    let isDiferent = false;
    let i = parseInt(Math.random() * 5);
    let j = parseInt(Math.random() * 5);
    while(!isDiferent){
        if(verifyOccurence(cpuMovements,i,j) == false){
            isDiferent = true;
            cpuMovements.push([i,j]);
            break;
        }
        i = parseInt(Math.random() * 5);
        j = parseInt(Math.random() * 5);
    }
    let li = document.querySelector(`#player .tabuleiro li[i="${i}"][j="${j}"]`);
    li.innerText = 'X'
    if(verifyOccurence(playerAllocated, i,j)){
        li.style.background = 'red';
    }
    checkWinCondition('cpu');
}

function eventClick_explode(e){
    const li = e.target;
    const x = li.getAttribute('i');
    const y = li.getAttribute('j');

    li.innerText = 'X'
    if(verifyOccurence(cpuAllocated, x,y)){
        li.style.background = 'green';
    }else{
        li.style.background = 'red';
    }
    playerMovements.push([x,y]);
    checkWinCondition('player');
    cpuMovement();
}

function allocateCPUShips(){
    let cpuGuesses = [];

    for(let cont = 0; cont<5 ; cont++){
        let isDiferent = false;
        let i = parseInt(Math.random() * 5);
        let j = parseInt(Math.random() * 5);
        while(!isDiferent){
            if(verifyOccurence(cpuGuesses,i,j) == false){
                isDiferent = true;
                cpuGuesses.push([i,j]);
            }
            i = parseInt(Math.random() * 5);
            j = parseInt(Math.random() * 5);
        }
    }
    return cpuGuesses;
}

function verifyOccurence(arr, i,j){
    let flag = false;
    for(let count = 0; count<arr.length ; count++){
        if(arr[count][0] == i && arr[count][1] == j){
            flag = true;
        } 
    }
    return flag;
}

function checkWinCondition(type){
    let movements = [];
    let shipPositions = [];
    let count = 0;
    if(type == 'cpu'){
        movements = cpuMovements;
        shipPositions = playerAllocated;
    }else{
        movements = playerMovements;
        shipPositions = cpuAllocated;
    }
    for(let i = 0 ; i<movements.length; i++){
        for(let j = 0; j<shipPositions.length ; j++){
            if(shipPositions[j][0] == movements[i][0] && shipPositions[j][1] == movements[i][1]){
                count++; 
            }
        }
    }
    if(count >= 5){
        let result = confirm(`O ${type} venceu, deseja reiniciar?`);
        if(result){
            window.location.reload(true);
        }
    }
}