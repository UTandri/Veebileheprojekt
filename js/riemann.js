const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const size = document.getElementById()


const canvas_size = screen.width * 70%

function teljed() {
    

    ctx.beginPath();
    ctx.strokeStyle = "gray"
    ctx.moveTo(0, 400);
    ctx.lineTo(1200, 400);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "gray"
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "gray"
    ctx.moveTo(0, 600);
    ctx.lineTo(1200, 0);
    ctx.stroke();
}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var sum = document.getElementById("sum");
var n = Number(slider.value);

output.innerHTML = slider.value;

function laius(n) {
    const l = 800 / n;
    return l;
}

function laius2(n) {
    const l = 400 / n;
    return l;
}

var l = laius(n);
var l2 = laius2(n);

function pikkus(pos_x) {
    let y = (pos_x - 200) / 2 - 100;
    return y;
}

function joonesta(pos_x, l, p, pos_y) {
    ctx.strokeStyle = "red"
    
    ctx.beginPath();
    ctx.globalAlpha = 0.2;
    ctx.rect(pos_x, pos_y, l, p);
    ctx.fillStyle = "blue";
    ctx.fill();
    
    ctx.stroke();
}

function tsykkel_pos(ristkylik, pikkus, l, vahe){
    var pos_y = pikkus(400) + 400;
    var summa_pos = 0
    for (let pos_x = 400; pos_x < 1200; pos_x += l) {
        let p = pikkus(pos_x);
        ristkylik(pos_x, l, p, pos_y);
        pos_y -= vahe;
        summa_pos += summa(p, l)
        
    } 
    return (summa_pos / 10000);
}

function summa(pikkus, laius) {
    return pikkus * laius;
}

function tsykkel_neg(ristkylik, pikkus, l){
    let pos_y = 400;
    var summa_neg = 0
    for (let pos_x = 0; pos_x < 400; pos_x += l) {
        let p = Math.abs(pikkus(pos_x));
        ristkylik(pos_x, l, p, pos_y);
        summa_neg += summa(p, l)
    }  
    return (summa_neg / 10000);
}

function uuenda() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    teljed();
    let l = laius(n);
    let l2 = laius2(n)
    let vahe = pikkus(400 + l) - pikkus(400);

    tsykkel_pos(joonesta, pikkus, l, vahe);
    tsykkel_neg(joonesta, pikkus, l2);
    sum.innerHTML = (tsykkel_pos(joonesta, pikkus, l, vahe) - tsykkel_neg(joonesta, pikkus, l2)).toFixed(4);
    
}


slider.oninput = function() {
    output.innerHTML = this.value;
    n = Number(this.value);
    uuenda();
}

uuenda();

