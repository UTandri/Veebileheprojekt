const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
const algne_suum = 30.0;
const suumimistegur = 1.3;

let suum = algne_suum;
let niheX = 0;
let niheY = 0;

function suumiSisse() {
    // korrutame nihet ka suumimisteguriga, et lõuendi keskkoht jääks paigale
    suum *= suumimistegur;
    niheX *= suumimistegur;
    niheY *= suumimistegur;
    joonista();
}
function suumiVälja() {
    suum /= suumimistegur;
    niheX /= suumimistegur;
    niheY /= suumimistegur;
    joonista();
}
function lähtestaVaade() {
    suum = algne_suum;
    niheX = 0;
    niheY = 0;
    joonista();
}

let tõmbame = false;
let hiireViimaneX = 0;
let hiireViimaneY = 0;

// hiire tagasikutsed, millega saab tõmbamist implementeerida
// allikas: https://stackoverflow.com/a/15037102

// hiirenupp alla, alustame tõmmet
canvas.onmousedown = function(e) {
    hiireViimaneX = parseInt(e.clientX);
    hiireViimaneY = parseInt(e.clientY);
    tõmbame = true;
}

// kui hiirenupp lastakse üles või hiir lahkub lõuendilt, katkestame tõmbamise
canvas.onmouseup = function(e) {
    tõmbame = false;
}
canvas.onmouseout = function(e) {
    tõmbame = false;
}

// hiire liigutamise tagasikutsel ja tõmmates uuendame nihet ja joonistame ümber
canvas.onmousemove = function(e){
    if(tõmbame){
        niheX += parseInt(e.clientX) - hiireViimaneX;
        niheY += parseInt(e.clientY) - hiireViimaneY;
        hiireViimaneX = parseInt(e.clientX);
        hiireViimaneY = parseInt(e.clientY);

        joonista();
    }
}

// suumimine hiirerullikuga
canvas.addEventListener("wheel", function(e) {
    // peatame lehel allakerimise, kui tahame hoopis graafikut suurendada
    e.preventDefault();

    if (e.deltaY > 0) {
        suumiVälja();
    } else {
        suumiSisse();
    }
})


// f(x) funktsioon, mida tahame joonistada
function f(x) {
    return (3 * Math.log(x)) / (1 - x*x);
}

// lõuend joonistab kõige teravamalt, kui koordinaadi murdosa on .5
// see funktsioon annab "terava koordinaadi", kasulik telgede joonistamiseks
function terav(x) {
    return Math.floor(x) + 0.5;
}

// võtavad matemaatilise koordinaadi ja annavad vastava koordinaadi lõuendil
function lõuendiX(x) {
    return suum * x + canvas.width / 2 + niheX;
}

var eelmineY;
function lõuendiY(y) {
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
    return canvas.height / 2 - suum * y + niheY;
}

// võtavad koordinaadi lõuendil ja annavad vastava matemaatilise koordinaadi
function matemaatilineX(x) {
    return (x - niheX - canvas.width / 2) / suum;
}
function matemaatilineY(y) {
    return -(y - niheY - canvas.height / 2) / suum;
}

function joonista() {
    // kustuta lõuend
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // joonistame ruudustiku ja ühikud

    ctx.strokeStyle = "lightgrey";
    ctx.lineWidth = 1;
    ctx.font = "20px serif";
    // mida väiksem suum, seda rohkem jätame ühikuid vahele
    numvahe = Math.max(1, Math.floor(90/suum));

    // horisontaalsed jooned
    var algus = Math.floor(matemaatilineY(canvas.height)) - 1;
    var lõpp = Math.floor(matemaatilineY(0)) + 1;

    for (var y = algus; y < lõpp; y += 1) {
        ctx.beginPath();
        ctx.moveTo(0, lõuendiY(y));
        ctx.lineTo(terav(canvas.width), lõuendiY(y));
        ctx.stroke();

        if (y % numvahe == 0) {
            ctx.fillText(y.toString(), lõuendiX(0.1), lõuendiY(y)+8);
        }
    }

    // vertikaalsed jooned
    algus = Math.floor(matemaatilineX(0)) - 1;
    lõpp = Math.floor(matemaatilineX(canvas.width)) + 1;

    for (var x = algus; x < lõpp; x += 1) {
        ctx.beginPath();
        ctx.moveTo(lõuendiX(x), 0);
        ctx.lineTo(lõuendiX(x), terav(canvas.height));
        ctx.stroke();
        if (x % numvahe == 0 && x != 0) {
            ctx.fillText(x.toString(), lõuendiX(x)-7, lõuendiY(0));
        }
    }

    // joonistame teljed

    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1

    // x-telg
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2+niheY);
    ctx.lineTo(terav(canvas.width), terav(canvas.height/2)+niheY);
    ctx.stroke();

    // y-telg
    ctx.beginPath();
    ctx.moveTo(terav(canvas.width/2)+niheX, 0);
    ctx.lineTo(terav(canvas.width/2)+niheX, terav(canvas.height));
    ctx.stroke();

    // joonista graafik
    ctx.beginPath();
    // lisame +10, et ümardamise tõttu lõuendi ääres ei jääks joonistamata
    lõpp = matemaatilineX(canvas.width) + 10;
    // Lisame murdjoone punktid, 0.1 sammude kaupa
    for (var x = 0; x < lõpp; x += 0.1) {
        ctx.lineTo(lõuendiX(x), lõuendiY(f(x)));
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    // telgede tähised
    ctx.font = "24px serif";
    ctx.fillText("y", lõuendiX(0.25), 20);
    ctx.fillText("x", canvas.width-20, lõuendiY(0.25))
}

// tuvastab, kui lõuendi suurus muutub (näiteks brauseri akent suurendades)
// allikas: https://stackoverflow.com/a/73831830
const observer = new ResizeObserver((entries) => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  joonista();
});
observer.observe(canvas);


// lihtsuse mõttes valime kõik nupud, mis on kindlas klassis, ja anname neile
// täpselt samad suumimise tagasikutsed
const nupuklassid = [".suumisisse", ".suumivälja", ".lähtestavaade"];
const vastavadFunktsioonid = [suumiSisse, suumiVälja, lähtestaVaade];

for (var klass = 0; klass < nupuklassid.length; klass++) {
    var nupud = document.querySelectorAll(nupuklassid[klass]);

    for (var i = 0; i < nupud.length; i++) {
        nupud[i].addEventListener("click", vastavadFunktsioonid[klass]);
    }
}
