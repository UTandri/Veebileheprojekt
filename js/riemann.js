const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function teljed() {
    ctx.beginPath();
    ctx.strokeStyle = "black"
    ctx.moveTo(0, 400);
    ctx.lineTo(1200, 400);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#d3d3d3"
    ctx.moveTo(0, 100);
    ctx.lineTo(1200, 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#d3d3d3"
    ctx.moveTo(0, 200);
    ctx.lineTo(1200, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#d3d3d3"
    ctx.moveTo(0, 300);
    ctx.lineTo(1200, 300);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#d3d3d3"
    ctx.moveTo(0, 500);
    ctx.lineTo(1200, 500);
    ctx.stroke();



    ctx.beginPath();
    ctx.strokeStyle = "black"
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#d3d3d3"
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#d3d3d3"
    ctx.moveTo(600, 0);
    ctx.lineTo(600, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#d3d3d3"
    ctx.moveTo(800, 0);
    ctx.lineTo(800, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#d3d3d3"
    ctx.moveTo(1000, 0);
    ctx.lineTo(1000, 600);
    ctx.stroke();
}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var sum = document.getElementById("sum");
var n = Number(slider.value);
var a = 0;
const element = document.querySelectorAll(".myBtn");

element.forEach(function(button) {
      button.addEventListener("click", function() {
        a = Number(button.dataset.value);
        uuenda()
      });
    });

output.innerHTML = slider.value;

function laius(n) {
    const l = 1200 / n;
    return l;
}

var l = laius(n);

function neg_laius(l) {
    var summa = 0;
    for (let x = 0; x < pikkus(x); x+=l) {
        summa+=l;
    }    
    return summa;
}

var neg = neg_laius(l)

function pikkus(pos_x) {
    //y = x/2 - 1
    let y = (pos_x - 200) / 2 - 100;
    return y;
}

function sin(pos_x) {
    //y = sin x
    let y = Math.sin(pos_x / 100 - 2) * 100;
    return y;
}

function sin_graph() {
    ctx.fillStyle = "red";
    for (let x = 0; x < 1200; x++) {
        let y = sin(x - Math.PI * 100) + 400;
        ctx.fillRect(x, y, 1, 1);
    }
}

function ruut(pos_x) {
    // y = 
    let y = ((pos_x - 400) / 16) ** 2 - 200;
    return y;
}

function ruut_graph() {
    ctx.fillStyle = "red";
    for (let x = 0; x <1200; x++) {
        let y = ruut(x) - 400;
        ctx.fillRect(x, -y, 1, 1);
    }
}

function arctan(pos_x) {
    let y = Math.atan(pos_x / 100 - 2) * 100;
    return y;
}

function arctan_graph() {
    ctx.fillStyle = "red";
    for (let x = 0; x < 1200; x++) {
        let y = arctan(-(x - Math.PI * 100)+85) + 400;
        ctx.fillRect(x, y, 1, 1);
    }
}

function joonesta(pos_x, l, p, pos_y) {
    ctx.strokeStyle = "blue"
    ctx.beginPath();
    ctx.globalAlpha = 0.2;
    ctx.rect(pos_x, pos_y, l, p);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function tsykkel_pos(ristkylik, pikkus, l, neg){
    var pos_y = -pikkus(neg) + 400;
    var summa_pos = 0;
    for (let pos_x = neg; pos_x < 1200; pos_x += l) {
        let p = pikkus(pos_x);
        let vahe = pikkus(pos_x + l) - pikkus(pos_x);
        ristkylik(pos_x, l, p, pos_y);
        pos_y -= vahe;
        summa_pos += summa(p, l);
        
    } 
    return (summa_pos / 10000);
}

function summa(pikkus, laius) {
    return pikkus * laius;
}

function tsykkel_neg(ristkylik, pikkus, l){
    let pos_y = 400;
    var summa_neg = 0;
    for (let pos_x = 0; pos_x < neg; pos_x += l) {
        let p = Math.abs(pikkus(pos_x));
        ristkylik(pos_x, l, p, pos_y);
        summa_neg += summa(p, l);
    }  
    return (summa_neg / 10000);
}

function uuenda() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    teljed();
    let l = laius(n);
    let neg = neg_laius(l);

    if (a == 0) {
        ctx.beginPath();
        ctx.strokeStyle = "red"
        ctx.moveTo(0, 600);
        ctx.lineTo(1200, 0);
        ctx.stroke();
        tsykkel_pos(joonesta, pikkus, l, neg);
        tsykkel_neg(joonesta, pikkus, l);
        sum.innerHTML = (tsykkel_pos(joonesta, pikkus, l, neg) - tsykkel_neg(joonesta, pikkus, l)).toFixed(4);
    }
    else if (a == 1) {
        sin_graph()
        tsykkel_pos(joonesta, sin, l, neg);
        tsykkel_neg(joonesta, sin, l);
        sum.innerHTML = (tsykkel_pos(joonesta, sin, l, neg) - tsykkel_neg(joonesta, sin, l)).toFixed(4);
    }
    else if (a == 2) {
        ruut_graph();
        tsykkel_pos(joonesta, ruut, l, neg);
        tsykkel_neg(joonesta, ruut, l);
        sum.innerHTML = (tsykkel_pos(joonesta, ruut, l, neg) - tsykkel_neg(joonesta, ruut, l)).toFixed(4);
    }

    else if (a == 3) {
        arctan_graph()
        tsykkel_pos(joonesta, arctan, l, neg);
        tsykkel_neg(joonesta, arctan, l);
        sum.innerHTML = (tsykkel_pos(joonesta, arctan, l, neg) - tsykkel_neg(joonesta, arctan, l)).toFixed(4);
    }
}


slider.oninput = function() {
    output.innerHTML = this.value;
    n = Number(this.value);
    uuenda();
}

uuenda();