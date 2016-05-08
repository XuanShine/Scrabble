var plateau_Jeu = document.getElementById("tableau"); //création du tableau de jeu

var tour_du_joueur = 0; // Tour du joueur 0.

var lettres_pose = "";
var LISTE_MOTS;

if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Charger le dictionnaire de mots:
    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object

        var reader = new FileReader();

        reader.onloadend = function(evt) {
            // alert(evt.target.result);
            LISTE_MOTS = evt.target.result.split("\n");
        };
        reader.readAsText(files[0]);
    }
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}




plateau_Jeu.addEventListener('click', action); // ecoute si un evt 'click' se produit sur <div id='tableau'>


function action(e) { // action declenche lors du click sur le plateau de jeu

    var e = window.event || e; // on recupere l'obj DOM du click
    var targ = e.target || e.srcElement;

    var colonne = targ.dataset.colonne;
    var ligne = targ.dataset.ligne;
    // alert("Colonne: " + colonne + " Ligne: " + ligne);
}

function creeParti() {
    var tailleGrille;
    var correctGrille = false;
    var correctJouers = false;


    tailleGrille = document.getElementById("tailleGrille").value;
    // If x is Not a Number or less than one or greater than 10
    if (isNaN(NB_JOUEUR) || NB_JOUEUR < 2 || NB_JOUEUR > 4) {
        correctJouers = false;
    } else {
        //tailleGrille = x;
        correctJouers = true;
    }

    if ((tailleGrille > 5 && tailleGrille <= 30) || tailleGrille == "") {
        correctGrille = true;

        if (tailleGrille == "") {
            tailleGrille = 15;
        }
    } else {
        correctGrille = false;
        tailleGrille = "Taille Grille incorrect";

    }


    if (correctGrille == true && correctJouers == true) {
        document.getElementById("tableau").innerHTML = "";

        genere_tableau(tailleGrille);
        genere_joueurs(NB_JOUEUR);
        genere_boutons_et_infos();
    } else {
        document.getElementById("tableau").innerHTML = "Donnes incorrects !";
    }
}


function genere_tableau(tailleGrille, nomJouers) {

    // Crea un elemento <table> y un elemento <tbody>
    var tabla = document.createElement("table");
    var tblBody = document.createElement("tbody");

    // Crea las celdas
    for (var i = 0; i < tailleGrille; i++) {
        // Crea las hileras de la tabla
        var hilera = document.createElement("tr");

        for (var j = 0; j < tailleGrille; j++) {
            // Crea un elemento <td> y un nodo de texto, haz que el nodo de
            // texto sea el contenido de <td>, ubica el elemento <td> al final
            // de la hilera de la tabla
            var celda = document.createElement("td");
            // var textoCelda = document.createTextNode("["+i+","+j+"]");
            //  celda.appendChild(textoCelda);

            celda.dataset['colonne'] = i; // on donne l'attribut colonne et ligneà chaque <td>
            celda.dataset['ligne'] = j;
            celda.setAttribute("ondrop", "drop(event)");
            celda.setAttribute("ondragover", "allowDrop(event)");

            hilera.appendChild(celda);
        }

        // agrega la hilera al final de la tabla (al final del elemento tblbody)
        tblBody.appendChild(hilera);
    }

    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    plateau_Jeu.appendChild(tabla);
    // modifica el atributo "border" de la tabla y lo fija a "2";
    tabla.setAttribute("border", "2");
}

// Generation des joueur
function genere_joueurs(nomJouers) {

    var plateau_joueurs = document.getElementById("joueurs");

    var tableau_joueurs = document.createElement("table");
    plateau_joueurs.appendChild(tableau_joueurs);

    for (var id_joueur = 0; id_joueur < NB_JOUEUR; id_joueur++) {
        var info_joueur = document.createElement("tr");
        tableau_joueurs.appendChild(info_joueur);

        var nom_joueur = document.createElement("td");
        info_joueur.appendChild(nom_joueur);
        nom_joueur.appendChild(document.createTextNode("Joueur " + id_joueur));
        nom_joueur.setAttribute("ondrop", "dropInList(event)");
        nom_joueur.setAttribute("ondragover", "allowDrop(event)");

        var liste_lettres_joueur = document.createElement("td");
        info_joueur.appendChild(liste_lettres_joueur);

        var lettres_joueur = document.createElement("ul");
        liste_lettres_joueur.appendChild(lettres_joueur);
        lettres_joueur.setAttribute("id", "jetons" + id_joueur);

        // score du joueur
        var score = document.createElement("td");
        info_joueur.appendChild(score);
        score.innerHTML = "Score : 0";
        score.setAttribute("id", "score" + id_joueur);

        // Lettres du joueur
        for (var num_lettre = 0; num_lettre < 7; num_lettre++) {
            var random_lettre = hacer();
            li_jeton = document.createElement("li");
            lettres_joueur.appendChild(li_jeton);

            var jeton = document.createElement("span");
            li_jeton.appendChild(jeton);
            jeton.setAttribute("class", "jeton");
            jeton.setAttribute("ondragstart", "drag(event)");
            jeton.id = random_lettre + num_lettre + id_joueur;
            jeton.draggable = true;

            var lettre_jeton = document.createTextNode(random_lettre);
            jeton.appendChild(lettre_jeton);
        }
    }
}

// Génère les boutons.
function genere_boutons_et_infos() {
    var div_button_info = document.getElementById("buttonandinfo");
    var info_tour_joueur = document.createElement("span")
    div_button_info.appendChild(info_tour_joueur);
    info_tour_joueur.innerHTML = "Tour du joueur " + tour_du_joueur;
    info_tour_joueur.setAttribute("id", "actualJoueur");

    var div_valider = document.getElementById("buttonvalider");
    div_valider.appendChild(document.createTextNode("Mot à vérifier: "));
    var input_valider = document.createElement("input");
    div_valider.appendChild(input_valider);
    input_valider.setAttribute("id", "check_word");

    // <button class="button btn" type="button" onclick="javascript:validerTour()">Valider</button>
    var button_valider = document.createElement("button");
    div_valider.appendChild(button_valider);
    button_valider.setAttribute("class", "button btn");
    button_valider.setAttribute("type", "button");
    button_valider.setAttribute("onclick", "validerTour()");
    button_valider.innerHTML = "Valider";

    var div_info = document.getElementById("info");
    div_info.innerHTML = "Pour retirer une lettre, glisser le sur le nom du joueur.";
}

// function pour generer letres aletoires
function hacer() {
    var aLetras = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "U", "V", "W", "X", "Y", "Z");
    var cLetra = aLetras[Math.floor(Math.random() * aLetras.length)];
    return cLetra;
}


// Drag'n'Drop
function drag(ev) {
    // Si c'est le tour du joueur.
    if (ev.target.id.endsWith(tour_du_joueur)) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    // Pas d'autres lettres dans la case.
    // TODO: Au moins une des cases autours contient une lettre.
    if (ev.target.innerHTML.length == 0) {
        ev.target.appendChild(document.getElementById(data));
        lettres_pose = lettres_pose + ev.target.childNodes[0].innerHTML;
        // alert(lettres_pose);
    }
}

function dropInList(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var span_data = document.getElementById(data);
    var letter_data = span_data.innerHTML;
    // C'est les lettres du joueur
    if (ev.target.innerHTML.endsWith(span_data.id.slice(-1))) {
        document.getElementById("jetons" + tour_du_joueur).appendChild(span_data);
        // retirer la lettre de la variable lettres_pose
        var pos = lettres_pose.indexOf(letter_data);
        lettres_pose = lettres_pose.slice(0, pos) + lettres_pose.slice(pos + 1);

        // alert(lettres_pose);
    } else {
        alert("Cette lettre n'appartient pas à cette personne.");
    }
}

// Valider Tour
function validerTour() {
    // check la validité des mots.
    var mot_to_be_check = document.getElementById("check_word").value;
    if (mot_to_be_check == "") {
        alert("Veuillez compléter le champs de vérification par votre mot.");
        return ;
    }
    if (!LISTE_MOTS) {
        alert("Veuillez charger un dictionnaire de mots. Il y en a un dans le dossier du jeu.");
    }
    if ((mot_to_be_check != "") && (is_member_word(mot_to_be_check, LISTE_MOTS))) {
        // Calcul score.
        var win_point = calcul_point(lettres_pose);
        var score_actual_player = document.getElementById("score" + tour_du_joueur);
        var new_score = parseInt(score_actual_player.innerHTML.split(" : ")[1], 10) + win_point;
        score_actual_player.innerHTML = "Score : " + new_score;

        // Complète le jeu de lettre du joueur.
        var lettres_joueur = document.getElementById("jetons" + tour_du_joueur).childNodes[0];
        for (var num_lettre = 0; num_lettre < lettres_pose.length; num_lettre++) {
            var random_lettre = hacer();
            li_jeton = document.createElement("li");
            lettres_joueur.appendChild(li_jeton);

            var jeton = document.createElement("span");
            li_jeton.appendChild(jeton);
            jeton.setAttribute("class", "jeton");
            jeton.setAttribute("ondragstart", "drag(event)");
            jeton.id = random_lettre + num_lettre + tour_du_joueur;
            jeton.draggable = true;

            var lettre_jeton = document.createTextNode(random_lettre);
            jeton.appendChild(lettre_jeton);
        }
        lettres_pose = "";
        document.getElementById("check_word").value = "";

        // Change de joueur
        tour_du_joueur = (tour_du_joueur + 1) % NB_JOUEUR;
        document.getElementById("actualJoueur").innerHTML = "Tour du joueur " + tour_du_joueur;
    } else {
        // Alerte si le mot n'a pas été copié dans le champ.
        alert("Le mot n'existe pas !");
    }
}

function calcul_point(mot) {
    var res = 0
    for (var lettre of mot) {
        if (is_member(lettre, ["A", "E", "I", "L", "N", "O", "R", "S", "T", "U"])) {
            res = res + 1;
        } else if (is_member(lettre, ["D", "G", "M"])) {
            res = res + 2;
        } else if (is_member(lettre, ["B", "C", "P"])) {
            res = res + 3;
        } else if (is_member(lettre, ["F", "V"])) {
            res = res + 4;
        } else if (is_member(lettre, ["J", "Q"])) {
            res = res + 8;
        } else {
            res = res + 10;
        }
    }
    return res;
}

function is_member(element, liste) {
    for (var i = 0; i < liste.length; i++) {
        if (liste[i] == element) {
            return true;
        }
    }
    return false;
}

function is_member_word(word, liste_word) {
    // Les mots ont un caractère inconnu en trop à la fin. On l'enlève.
    for (var i = 0; i < liste_word.length; i++) {
        if (liste_word[i].slice(0, -1).toLowerCase() == word.toLowerCase()) {
            return true;
        }
    }
    return false;
}
