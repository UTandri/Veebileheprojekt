const suumimistegur = 1.3;
const algne_suum = 30.0;

const suurendatud_niheX = -450;
const suurendatud_niheY = 0;
const suurendatud_suum = 500;

const lõuendid = document.querySelectorAll(".lhospitalgraafik");

function seaAlgneVaade(lõuend) {
    if (lõuend.indeks == 2 || lõuend.indeks == 3) {
        lõuend.suum = suurendatud_suum;
        lõuend.niheX = suurendatud_niheX;
        lõuend.niheY = suurendatud_niheY;
    } else {
        lõuend.suum = algne_suum;
        lõuend.niheX = 0;
        lõuend.niheY = 0;
    }
}


for (var i = 0; i < lõuendid.length; i++) {
    lõuendid[i].kontekst = lõuendid[i].getContext("2d");
    lõuendid[i].indeks = i;

    seaAlgneVaade(lõuendid[i]);
}

function suumi(tegur, lõuend) {
    // korrutame nihet ka suumimisteguriga, et lõuendi keskkoht jääks paigale
    lõuend.suum *= tegur;
    lõuend.niheX *= tegur;
    lõuend.niheY *= tegur;
    joonista(lõuend);
}

function suumiSisse(e) {
    indeks = e.target.dataset.graafikuNumber.toString();
    suumi(suumimistegur, lõuendid[indeks]);
}
function suumiVälja(e) {
    indeks = e.target.dataset.graafikuNumber.toString();
    suumi(1/suumimistegur, lõuendid[indeks]);
}
function lähtestaVaade(e) {
    indeks = e.target.dataset.graafikuNumber.toString();
    seaAlgneVaade(lõuendid[indeks]);
    joonista(lõuendid[indeks]);
}


let tõmbame = false;
let hiireViimaneX = 0;
let hiireViimaneY = 0;

// hiire tagasikutsed, millega saab tõmbamist implementeerida
// allikas: https://stackoverflow.com/a/15037102

for (var i = 0; i < lõuendid.length; i++) {
    const praeguneLõuend = lõuendid[i];

    // hiirenupp alla, alustame tõmmet
    praeguneLõuend.onmousedown = function(e) {
        hiireViimaneX = parseInt(e.clientX);
        hiireViimaneY = parseInt(e.clientY);
        tõmbame = true;
    }

    // kui hiirenupp lastakse üles või hiir lahkub lõuendilt, katkestame tõmbamise
    praeguneLõuend.onmouseup = function(e) {
        tõmbame = false;
    }
    praeguneLõuend.onmouseout = function(e) {
        tõmbame = false;
    }

    // hiire liigutamise tagasikutsel ja tõmmates uuendame nihet ja joonistame ümber
    praeguneLõuend.onmousemove = function(e){
        if(tõmbame){
            praeguneLõuend.niheX += parseInt(e.clientX) - hiireViimaneX;
            praeguneLõuend.niheY += parseInt(e.clientY) - hiireViimaneY;
            hiireViimaneX = parseInt(e.clientX);
            hiireViimaneY = parseInt(e.clientY);

            joonista(praeguneLõuend);
        }
    }

    // suumimine hiirerullikuga
    praeguneLõuend.addEventListener("wheel", function(e) {
        // peatame lehel allakerimise, kui tahame hoopis graafikut suurendada
        e.preventDefault();

        var tegur = Math.max(-5, Math.min(5, e.deltaY));
        tegur = 1 - tegur / 150;
        suumi(tegur, praeguneLõuend);
    });
}


// f(x) funktsioon, mida tahame joonistada
function f(x) {
    return (3 * Math.log(x)) / (1 - x*x);
}

function kolmlnx(x) {
    return 3 * Math.log(x);
}

function üksmiinusxruudus(x) {
    return 1 - x*x;
}

function kolmx(x) {
    return 3 * x - 3;
}

// lõuend joonistab kõige teravamalt, kui koordinaadi murdosa on .5
// see funktsioon annab "terava koordinaadi", kasulik telgede joonistamiseks
function terav(x) {
    return Math.floor(x) + 0.5;
}

// võtavad matemaatilise koordinaadi ja annavad vastava koordinaadi lõuendil
function lõuendiX(x, lõuend) {
    return lõuend.suum * x + lõuend.width / 2 + lõuend.niheX;
}

var eelmineY;
function lõuendiY(y, lõuend) {
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
    return lõuend.height / 2 - lõuend.suum * y + lõuend.niheY;
}

// võtavad koordinaadi lõuendil ja annavad vastava matemaatilise koordinaadi
function matemaatilineX(x, lõuend) {
    return (x - lõuend.niheX - lõuend.width / 2) / lõuend.suum;
}
function matemaatilineY(y, lõuend) {
    return -(y - lõuend.niheY - lõuend.height / 2) / lõuend.suum;
}

function joonistaTaust(l) {
    // ruudustik ja ühikud

    l.kontekst.strokeStyle = "lightgrey";
    l.kontekst.lineWidth = 1;
    l.kontekst.font = "20px serif";
    // mida väiksem suum, seda rohkem jätame ühikuid vahele
    numvahe = Math.max(1, Math.floor(90/l.suum));

    // horisontaalsed jooned
    var algus = Math.floor(matemaatilineY(l.height, l)) - 1;
    var lõpp = Math.floor(matemaatilineY(0, l)) + 1;

    for (var y = algus; y < lõpp; y += 1) {
        l.kontekst.beginPath();
        l.kontekst.moveTo(0, lõuendiY(y, l));
        l.kontekst.lineTo(terav(l.width), lõuendiY(y, l));
        l.kontekst.stroke();

        if (y % numvahe == 0) {
            l.kontekst.fillText(y.toString(), lõuendiX(0.1, l), lõuendiY(y, l)+8);
        }
    }

    // vertikaalsed jooned
    algus = Math.floor(matemaatilineX(0, l)) - 1;
    lõpp = Math.floor(matemaatilineX(l.width, l)) + 1;

    for (var x = algus; x < lõpp; x += 1) {
        l.kontekst.beginPath();
        l.kontekst.moveTo(lõuendiX(x, l), 0);
        l.kontekst.lineTo(lõuendiX(x, l), terav(l.height));
        l.kontekst.stroke();
        if (x % numvahe == 0 && x != 0) {
            l.kontekst.fillText(x.toString(), lõuendiX(x, l)-7, lõuendiY(0, l)+8);
        }
    }

    // joonistame teljed

    l.kontekst.strokeStyle = "gray";
    l.kontekst.lineWidth = 1

    // x-telg
    l.kontekst.beginPath();
    l.kontekst.moveTo(0, l.height/2+l.niheY);
    l.kontekst.lineTo(terav(l.width), terav(l.height/2)+l.niheY);
    l.kontekst.stroke();

    // y-telg
    l.kontekst.beginPath();
    l.kontekst.moveTo(terav(l.width/2)+l.niheX, 0);
    l.kontekst.lineTo(terav(l.width/2)+l.niheX, terav(l.height));
    l.kontekst.stroke();
}

function joonistaGraafik(l, funktsioon, värv) {

    l.kontekst.beginPath();
    // lisame +10, et ümardamise tõttu lõuendi ääres ei jääks joonistamata
    lõpp = matemaatilineX(l.width, l) + 10;
    // Lisame murdjoone punktid, 0.1 sammude kaupa
    for (let x = 0; x < lõpp; x += 0.1) {
        l.kontekst.lineTo(lõuendiX(x, l), lõuendiY(funktsioon(x), l));
    }
    l.kontekst.strokeStyle = värv;
    l.kontekst.lineWidth = 2;
    l.kontekst.stroke();
}

function joonistaTelgedeTähised(l) {
    l.kontekst.font = "20px serif";
    l.kontekst.fillText("y", lõuendiX(0, l)+10, 20);
    l.kontekst.fillText("x", l.width-20, lõuendiY(0, l)-10)
}

function joonistaPunktiirid(l, x, f1, f2) {
    l.kontekst.setLineDash([3, 3]);
    l.kontekst.strokeStyle = "#333333";
    l.kontekst.lineWidth = 1;

    l.kontekst.beginPath();
    l.kontekst.moveTo(lõuendiX(x, l), lõuendiY(f1(x), l));
    l.kontekst.lineTo(lõuendiX(x, l), lõuendiY(0, l));
    l.kontekst.stroke();

    l.kontekst.beginPath();
    l.kontekst.moveTo(lõuendiX(x, l), lõuendiY(f2(x), l));
    l.kontekst.lineTo(lõuendiX(x, l), lõuendiY(0, l));
    l.kontekst.stroke();

    l.kontekst.setLineDash([]);

    l.kontekst.fillText("1+h", lõuendiX(x, l), lõuendiY(0, l)+8);
}

function joonista(l) {
    // kustuta lõuend
    l.kontekst.clearRect(0, 0, l.width, l.height);

    joonistaTaust(l);

    switch(l.indeks) {
        case 0:
            joonistaGraafik(l, f, "blue");
            break;
        case 1:
            joonistaGraafik(l, kolmlnx, "orange");
            joonistaGraafik(l, üksmiinusxruudus, "red");
            break;
        case 2:
            joonistaGraafik(l, kolmlnx, "orange");
            joonistaGraafik(l, üksmiinusxruudus, "red");
            joonistaPunktiirid(l, 1.1, kolmlnx, üksmiinusxruudus);
            break;
        case 3:
            joonistaGraafik(l, kolmlnx, "orange");
            joonistaGraafik(l, kolmx, "gray");
            break;
        case 4:
            joonistaGraafik(l, f, "blue");
            // TODO horisontaalne joon
            break;
    }

    joonistaTelgedeTähised(l);

}

// tuvastab, kui lõuendi suurus muutub (näiteks brauseri akent suurendades)
// allikas: https://stackoverflow.com/a/73831830

for (let i = 0; i < lõuendid.length; i++) {
    let praeguneLõuend = lõuendid[i];
    const observer = new ResizeObserver((entries) => {
        praeguneLõuend.width = praeguneLõuend.clientWidth;
        praeguneLõuend.height = praeguneLõuend.clientHeight;

        joonista(praeguneLõuend);
    });
    observer.observe(lõuendid[i]);
}



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

var suurendusnupp = document.querySelectorAll("#suurendusnupp")[0];
suurendusnupp.addEventListener("click", function() {

    var progress = 0;
    var algneNiheX = lõuendid[1].niheX;
    var algneNiheY = lõuendid[1].niheY;
    var algneSuum = lõuendid[1].suum;

    var intervalID = window.setInterval(function() {
        if (progress >= 1) {
            window.clearInterval(intervalID);
        }

        lõuendid[1].niheX = suurendatud_niheX * progress + algneNiheX * (1-progress);
        lõuendid[1].niheY = algneNiheY * (1-progress);
        lõuendid[1].suum = suurendatud_suum * progress + algneSuum * (1-progress);
        joonista(lõuendid[1]);

        progress += 0.01;
    }, 10)
});