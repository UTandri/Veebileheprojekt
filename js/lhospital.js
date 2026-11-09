const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");

// f(x) funktsioon, mida tahame joonistada
function f(x) {
    return (3 * Math.log(x)) / (1 - x*x);
}

// <canvas> joonistab kõige teravamalt siis, kui koordinaat on
// "kahe piksli vahel", ehk murdosa on .5
// see funktsioon annab "terava koordinaadi", kasulik telgede joonistamiseks
function terav(x) {
    return Math.floor(x) + 0.5;
}

// võtab matemaatilise x-koordinaadi ja annab vastava koordinaadi lõuendil 
function graafikuX(x) {
    return 20*x + canvas.width / 2;
}

// võtab x-koordinaadi lõuendil ja annab vastava matemaatilise koordinaadi
function matemaatilineX(x) {
    return (x - canvas.width / 2)/20
}

// võtab matemaatilise y-koordinaadi ja annab vastava koordinaadi lõuendil
var eelmineY;
function graafikuY(y) {
    if (Number.isNaN(y)) {
        // kui y on määramata, kasutame eelmist
        y = eelmineY;
    } else if (y === Number.POSITIVE_INFINITY) {
        // kui y on lõpmatu, kasutame väga suurt numbrit
        y = 1000;
    } else if (y === Number.NEGATIVE_INFINITY) {
        y = -1000;
    }

    eelmineY = y;
    return canvas.height/2-20*y;
}

function joonista() {
    // kustuta lõuend
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // joonista graafik
    ctx.beginPath();
    var lõpp = matemaatilineX(canvas.width);
    for (var i = 0; i < lõpp; i += 0.1) {
        ctx.lineTo(graafikuX(i), graafikuY(f(i)));
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2
    ctx.stroke();

    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1

    // joonista x-telg
    ctx.beginPath();
    ctx.moveTo(0, terav(canvas.height/2));
    ctx.lineTo(terav(canvas.width), terav(canvas.height/2));
    ctx.stroke();

    // joonista y-telg
    ctx.beginPath();
    ctx.moveTo(terav(canvas.width/2), 0);
    ctx.lineTo(terav(canvas.width/2), terav(canvas.height));
    ctx.stroke();
}

// tuvastab, kui lõuendi suurus muutub (näiteks brauseri akent suurendades)
// allikas: https://stackoverflow.com/a/73831830
const observer = new ResizeObserver((entries) => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  joonista();
});
observer.observe(canvas)