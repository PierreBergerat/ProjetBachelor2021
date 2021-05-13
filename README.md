# AlgObserver
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6/ES2016+-blue?style=?style=plastic&logo=javascript&logoColor=F7DF1E)](https://github.com/PierreBergerat/ProjetBachelor2021) [![HTML](https://img.shields.io/badge/HTML-5-blue?style=?style=plastic&logo=html5)](https://github.com/PierreBergerat/ProjetBachelor2021)

AlgObserver permet d'augmenter des fonctions JavaScript, built-in ou non, avec d'autres fonctions définies par l'utilisateur. Dans l'exemple fourni, l'augmentation des fonctions permet l'ajout d'un outil de journalisation à chacune des fonctions injectées, et autorise ainsi le parcours rétrospectif de ces dernières afin de mieux comprendre le fonctionnement du code.

- [AlgObserver](#algobserver)
  - [1. Installation](#1-installation)
  - [2. Utilisation](#2-utilisation)
    - [2.1. Observer.js](#21-observerjs)
      - [2.1.1. new Observer(objects, namespaces, functions, blacklist).startObserver()](#211-new-observerobjects-namespaces-functions-blackliststartobserver)
        - [2.1.1.1. objects](#2111-objects)
        - [2.1.1.2. namespaces](#2112-namespaces)
        - [2.1.1.3. functions](#2113-functions)
          - [2.1.1.3.1. advices](#21131-advices)
        - [2.1.1.4. blacklist](#2114-blacklist)
        - [2.1.1.5. startObserver()](#2115-startobserver)
        - [2.1.1.6. Exemple complet d'instanciation d'Observer](#2116-exemple-complet-dinstanciation-dobserver)
      - [2.1.2. run()](#212-run)
    - [2.2. Teacher.js](#22-teacherjs)
      - [2.2.1. Variables globales](#221-variables-globales)
      - [2.2.2. setText](#222-settext)
      - [2.2.3. log](#223-log)
      - [2.2.4. TItem](#224-titem)
        - [2.2.4.1. Comment ajouter un listener](#2241-comment-ajouter-un-listener)
          - [2.2.4.1.1. Paramètres d'un listener](#22411-paramètres-dun-listener)
      - [2.2.5. updateObjects](#225-updateobjects)
      - [2.2.6. display](#226-display)
  - [3. Exemple complet d'utilisation](#3-exemple-complet-dutilisation)
    - [3.1. Description](#31-description)
    - [3.2. Specialist.js](#32-specialistjs)
    - [3.3. Observer.js](#33-observerjs)
    - [3.4. Teacher.js](#34-teacherjs)

## 1. Installation
Aucune installation n'est requise, il suffit d'appeler l'[observer](Projet_Bachelor/observer.js) dans la page HTML contenant le code et d'appeler les fonctions suivantes.
```html
<!-- Index.html -->
<script src="scriptACapturer.js"></script> 
<script src="observer.js"></script>
<script>
  /* Des explications sont présentes plus bas */
    new Observer(objects, namespaces, functions, blacklist);
    run();
</script>
```
>L'ordre d'appel des scripts est important car scriptACapturer doit être chargé pour qu'observer puisse augmenter ses fonctions.
## 2. Utilisation
### 2.1. Observer.js
Observer.js est le point central d'AlgObserver car c'est lui qui permet l'injection des fonctions. Il peut fonctionner seul mais il a été créé avec l'idée d'être joint au programme Teacher.js (voir plus bas). Comme vu plus haut, plusieurs appels de fonctions doivent être effectués pour que le programme fonctionne.
#### 2.1.1. new Observer(objects, namespaces, functions, blacklist).startObserver()
  
Cet appel crée une nouvelle instance d'Observer et permet d'injecter les fonctions selon les critères passés en paramètres. Ceux-ci sont, dans l'ordre :
##### 2.1.1.1. objects
Tableau des classes à injecter. Pour injecter une classe, il faut indiquer le nom complet de celle-ci. Cet argument attend un tableau même si une seule classe est injectée (ou aucune).
```js
  [] // aucune classe ne sera injectée
  [maClasse] // la classe "maClasse" sera injectée
  [maClasse1, maClasse2, maClasse3] // toutes les classes indiquées seront injectées
```
##### 2.1.1.2. namespaces
Tableau des namespaces à injecter. Dans la plupart des cas, on voudra injecter globalThis pour injecter toutes les fonctions globales (c'est-à-dire des fonctions ne faisant pas parties d'objets). Cet argument attend un tableau même si un seul namespace est injecté (ou aucun).
```js
  [] // aucun namespace ne sera injecté
  [globalThis] // le namespace global sera injecté
```
##### 2.1.1.3. functions
Tableau des fonctions à injecter. Celles-ci sont en fait des objets javascript dont les propriétés "aspect" et "advice" ont été définies avec respectivement un aspect et un advice. Exemple de fonction valide.
```js
1. {
2.    aspect: (...args) => { console.log(args[0],args[1],args[2]) },
3.    advice: "before"
4. }
```
Les lignes *1* et *4* indiquent la création d'un objet JavaScript. En effet, les accolades permettent une nouvelle instanciation de la classe Object, tout comme des crochets permettent la création implicite d'une instance de Array.

Les mots "aspect" et "advice" des lignes *2* et *3* sont les décalarations de propriétés de l'objet. Dans le cas actuel d'utilisation, les noms doivent obligatoirement être "aspect" et "advice", sans quoi observer.js ne pourra pas fonctionner.

A la ligne *2* une propriété nommée aspect est donc définie : celle-ci est une fonction (indiquée par les parenthèses suivie de la "fat arrow" **=>** et des accolades) dont l'argument est  un [Rest parameter](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/rest_parameters) (sauf pour "afterReturning" qui ne contient qu'une valeur et qui n'a donc pas besoin d'être un [Rest parameter](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/rest_parameters)), c'est-à-dire un paramètre unique précédé de trois points de suspension (comme ici avec ...args). Ce [Rest parameter](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/rest_parameters) sera soit composé de trois éléments, soit de un seul élément. Le nombre sera variable en fonction de l'advice indiqué (voir plus bas pour la liste des advices). Pour tout advice autre que "afterReturning", trois éléments seront présents dans args :
1. la fonction actuellement exécutée sous forme d'objet
   ```js
   //Exemple de premier argument de args
   function maFonction(param1, param2, param3)
   ```
2. le nom de la fonction sous forme de String
   ```js
   //Exemple de deuxième argument de args
   "maFonction"
   ```
3. les arguments de la fonction sous forme d'un tableau de taille arguments(args[0]).length
   ```js
   //Exemple de troisième argument de args
   [
     "premierParametre",
     function x(){return true},
     false
   ]
   ```

Dans le cas d'"afterReturning", seule **la valeur de retour** sera présente dans args (qui n'a donc pas besoin d'être un [Rest parameter](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/rest_parameters)).
> Le nombre variable d'arguments signifie qu'une fonction à la fois définie pour "afterReturning" et un autre advice devra pouvoir gérer les cas où les arguments 2 et 3 ne seraient pas définis, par exemple en effectuant le test :
```js
/* Fonctionne car "undefined" est "falsy"
 cf. https://developer.mozilla.org/fr/docs/Glossary/Falsy */
if(args[1] && args[2]){ 
  ...
}
// "afterReturning"
else {
  ...
}
```
###### 2.1.1.3.1. advices
4 advices sont reconnus par observer.js et permettent d'indiquer au programme où injecter la fonction. Les advices sont obligatoirement indiqués par un String représentant leur nom :
- "before" : la fonction injectée s'exécutera avant la fonction à injecter.
- "around" : la fonction injectée s'exécutera avant **et** après la fonction à injecter
- "after" : la fonction injectée s'exécutera après la fonction à injecter
- "afterReturning" : la fonction injectée s'exécutera après la fonction à injecter et ne recevra *que la valeur de retour de la fonction à injecter* en paramètre
##### 2.1.1.4. blacklist
Tableau de string contenant les noms des fonctions à ne pas injecter. Cet argument attend un tableau même si un seul string est indiqué (ou aucun).
```js
  [] // aucune fonction n'est retirée de la liste
  ["maFonction"] // la fonction "maFonction" sera blacklistée
  ["maFonction1", "maFonction2", "maFonction3"] // toutes les fonctions indiquées seront blacklistées.
```
##### 2.1.1.5. startObserver()
Cette méthode d'Observer permet de commencer l'injection des méthodes. En général, il sera plus utile d'appliquer cette méthode directement à la suite de l'instanciation.
```js
new Observer([],
            [globalThis],
            [{aspect: (...args) => { console.log(args[0], args[1], args[2])}, advice: "before"}],
            []
        ).startObserver(); // Démarrage immédiat de l'injection des fonctions
```
##### 2.1.1.6. Exemple complet d'instanciation d'Observer
```js
/* Instanciation de l'observer */
new Observer(
        /* objects : aucune classe ne sera injectée */
        [],

        /* namespaces : le namespace "globalThis" sera injecté */
        [globalThis],

        /* Déclaration du tableau de fonctions à injecter
           Pour des explications sur Teacher.log(), voir plus bas */
        [

            /* Première fonction */
            {
                /* la fonction aspect */
                aspect: (...args) => { Teacher.log(args[0], args[1], args[2]) },
                advice: "before"
            },

            /* Deuxième fonction */
            {
                aspect: (value) => {
                    if (value != undefined) {
                        Teacher.log(value)
                    }
                    else {
                        Teacher.log("undefined")
                    }
                    return value
                },
                advice: "afterReturning"
            }
        ],

        /* blacklist : aucune fonction n'est blacklistée */
        []
    ).startObserver(); // Lancement immédiat de l'injection
```
#### 2.1.2. run()
La fonction run, ou toute autre fonction du même usage, doit être utilisée pour retarder l'exécution de l'algorithme à observer. Ceci est dû au fait que le script à observer (specialist.js) doit déjà être chargé en mémoire pour qu'observer.js puisse injecter les fonctions. Une fois les fonctions injectées, le script peut être exécuté normalement.
```HTML
<!-- Exemple d'ordre valide des appels de scripts -->

<!-- Chargement de l'observer -->
<script src="observer.js"></script>

<!-- Chargement du script -->
<script src="scriptAInjecter.js"></script>

<!-- Instanciation d'Observer (paramètres omis) et lancement de l'algorithme à observer -->
<script>
    new Observer(...).startObserver();
    run();
</script>
```
```js
/* scriptAInjecter.js */
function run(){
  let x = 30, y = 20;
  PGCD(x,y)
}
```
### 2.2. Teacher.js
Teacher.js permet, grâce à ses différentes fonctions, d'afficher de façon dynamique les données lues par l'Observer et a été créé dans ce but. En effet, bien qu'Observer n'ait pas besoin de Teacher pour fonctionner, l'utilisation jointe des outils permet d'ajouter une dimension pédagogique au code observé par le biai d'outils visuels. Ci-dessous sont expliquées les différentes méthodes implémentées par défaut dans le Teacher, ainsi qu'une explication sur la façon d'ajouter de nouveaux outils. Dans sa conception, Teacher est fait pour être modifié et adapté aux besoins de l'utilisateur mais il fournit une structure de base qui pourra être agrémentée de nouvelles fonctionnalités ou servir de base pour un script personnalisé similaire.
> La quasi totalité des méthodes de Teacher sont statiques, c'est pourquoi il faudra les appeler via
```js
Teacher.nomDeLaMethode()
```
Il s'agit là d'une façon d'éviter de capturer les fonctions de Teacher sans avoir à les mettre en blacklist car par défaut, les classes ne sont pas injectées.
#### 2.2.1. Variables globales
Teacher définit un certain nombre de variables dans ses premières lignes. Celles-ci permettent un stockage et un accès simples.
```js
var _logs = []; // stocke les journaux reçus dans la fonction log.
var _curr = -1; // log actuellement affiché (par défaut -1 -> sert à l'initialisation d'autres variables)
const _displayContainer = document.getElementById('display'); // container HTML où seront affichées les données
const _algorithm = document.getElementById('algorithm'); // container HTML permettant d'afficher l'entièreté d'un script
var _actionListeners = new Map(); // actions devant être exécutées avant l'appel d'une certaine fonction
var _afterListeners = new Map(); // actions devant être exécutées après l'appel d'une certaine fonction
var _fullcode = "" // string permettant de stocker le code d'un script
```
#### 2.2.2. setText
Permet d'afficher le code entier de l'algorithme capturé dans le container HTML _algorithm. Pour lui passer le code sous forme de chaîne de caractères, on peut utiliser la fonction asynchrone fetch().
```js
fetch('specialist.js') // specialist.js contient le code de l'algorithme à injecter
  .then(res => res.text()) // Une fois la promesse de fetch réalisée, on veut en retirer le text (par opposition au code d'erreur ou au statut de la promesse)
  .then(data => Teacher.setText(data)) // Une fois res.text() réalisé, on veut envoyer les données ainsi récupérées vers Teacher.setText()
```
> fetch() étant asynchrone, toute fonction située à l'extérieur des ".then()" s'exécutera en concurrence avec fetch(). En général cela ne posera pas de problème si le seul but de fetch est d'obtenir le code du spécialiste.
#### 2.2.3. log
log() est une fonction qui permet de gérer les deux cas obtenus lors de l'injection d'une même fonction avec l'advice "afterReturning" et un des autres advices. En effet, elle va permettre la journalisation de toutes les fonctions qui lui sont passées en paramètres et gérer les cas où les arguments *name* et *args* ne seraient pas définis en ajoutant l'argument reçu (dans ce cas la *valeur de retour*) au tableau des logs en l'insérant au dernier index *ne possédant pas 4 données* (fonction, nom, arguments et valeur de retour).
#### 2.2.4. TItem
La classe TItem est un outil puissant car elle permet, par son extension (avec le mot-clé *extends*) de créer de nouvelles classes qui implémenteront obligatoirement les méthodes *setBeforeFunction(beforeAction)* et *setAfterFunction(afterAction)*, permettant respectivement de créer des listeners qui exécuteront une fonction avant ou après l'appel d'une autre fonction dans la méthode *display()*. Ce système permet de créer un outil dynamique de visualisation de l'algorithme qui s'adaptera automatiquement aux fonctions reçues une fois celles-ci paramétrées. Dans l'exemple du tri d'un tableau, on pourra par exemple lier un objet HTML à la fonction de "swap" afin de modifier l'affichage d'un tableau HTML en même temps que le vrai tableau est modifié par l'algorithme.
##### 2.2.4.1. Comment ajouter un listener
Lors de l'instanciation d'une classe étendant la classe TItem, il est possible de lui ajouter des listeners en utilisant la fonction super() avec en arguments les listeners désirés.
Ceux-ci sont de forme (pour un exemple voir teacher.js dans le dossier demo):
```js
//before/afterlistener
//Structure : Array<Array<String,Function>>
[
    [
        'fonctionAEcouter1', (args) => {
            fonction1(args)
        }
    ],
    [
        'fonctionAEcouter2', (args) => {
            ...
        }
    ]
]
```
où le string représente la fonction à écouter et la fonction qui le suit, ce qu'il faut faire quand on capture la fonction à écouter.
###### 2.2.4.1.1. Paramètres d'un listener
Les paramètres possibles d'un listener sont au nombre de 3 mais on en utilisera généralement 2 :
1. L'objet lui-même (équivalent d'un "this" local) qui permet par exemple d'exécuter des méthodes de l'objet ou de modifier ses attributs. On nommera en général ce paramètre "that".
```js
['fonctionAEcouter',(that) => {that.methodeDeLObjetThat}]
['fonctionAEcouter',(that) => {that.x++}]
```
2. Un log (tableau), qui sera le log courant pour une fonction beforeListener et le log précédent pour une fonction afterListener. On nommera en général ce paramètre "log". Celui-ci est composé de 4 composants, accessibles par leur index (ex. log[0]) :
   1. Le nom de la fonction journalisée.
   2. Les paramètres d'entrées de la fonction journalisée.
   3. Le code source de la fonction journalisée.
   4. La valeur de retour de la fonction journalisée.
```js
['fonctionAEcouter',(that,log) => {that.select(log[3])}] // Effectue une opération sur that avec la valeur de retour du log
```
3. Un booléen indiquant dans quel "sens" l'affichage se fait (càd si l'utilisateur avance ou recule dans les explications (voir display)). On nommera en général ce paramètre "isGoingForward".
```js
// Effectue une opération différente selon de si isGoingForward est vrai ou faux.
['fonctionAEcouter',(that,log,isGoingForward) => {if(isGoingForward){
  ...
} else {
  ...
}}]
```
#### 2.2.5. updateObjects
updateObjects() doit être exécuté à chaque fois que le log actuellement utilisé change car c'est lui qui gère les listeners et qui va donc permettre d'actualiser les différents objets, d'où son nom. Il prend en paramètres l'index du journal actuel (_curr) et un booléen isGoingForward indiquant dans quel "sens" l'affichage se fait (càd si l'utilisateur avance ou recule dans les explications (voir display)).
#### 2.2.6. display
Display permet l'affichage des logs et l'initialisation des objets qui y seront liés. On se sert de la valeur de _curr comme initialisateur.
```js
if (_curr != -1) {
    if (shouldGoForward) {
        _curr < (_logs.length - 1) ? _curr += 1 : _curr;
    } else {
        _curr > 0 ? _curr -= 1 : _curr;
    }
} else {// Init
    // On initalise des instances d'objets qui étendent la classe TItem
    new TType(args,...)
    new TType(args,...)
    _curr++;
}
```
Par défaut, Teacher affiche les différents éléments reçus dans le log et "met en gras" la section d'_algorithm qui correspond à la fonction courante.
## 3. Exemple complet d'utilisation
### 3.1. Description
Dans cet exemple (trouvable dans le dossier demo), il sera montré comment utiliser les différents modules expliqués précédemment avec comme objectif d'injecter un algorithme de tri avec l'observer et d'afficher le tri effectué à l'écran au moyen d'un tableau HTML.
### 3.2. Specialist.js
Specialist.js va contenir l'algorithme suivant, qui permet d'effectuer un bubble sort sur un tableau donné.
```js
// Specialist.js
var arrayToSort = [12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 4891, 455, 23, 234, 213]
bubble_Sort(arrayToSort)

function bubble_Sort(array) {
    var hasSwapped;
    var n = array.length - 1;
    var sortedArray = array;
    do {
        hasSwapped = false;
        for (var i = 0; i < n; i++) {
            if (sortedArray[i] < sortedArray[i + 1]) {
                swap(sortedArray, i)
                hasSwapped = true;
            }
        }
        n--;
    } while (hasSwapped);
    return sortedArray;
}

function swap(a, i) {
    var temp = a[i];
    a[i] = a[i + 1];
    a[i + 1] = temp;
    return a
}
```
Afin de capturer un événement important, soit la condition de swap, nous allons créer une fonction qui compare les éléments plutôt que de simplement utiliser l'opérateur "plus petit que". De plus, nous allons également ajouter une fonction "run" qui permettra, comme expliqué plus haut, de retarder l'exécution de l'algorithme :
```js
// Specialist.js
const run = () => { // Permet de retarder l'exécution de l'algorithme
    var arrayToSort = [12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 4891, 455, 23, 234, 213]
    bubble_Sort(arrayToSort)
}

function bubble_Sort(array) {
    var hasSwapped;
    var n = array.length - 1;
    var sortedArray = array;
    do {
        hasSwapped = false;
        for (var i = 0; i < n; i++) {
            if (isSmaller(sortedArray[i], sortedArray[i + 1])) {
                swap(sortedArray, i)
                hasSwapped = true;
            }
        }
        n--;
    } while (hasSwapped);
    return sortedArray;
}

function isSmaller(a, b) { // Permet de capturer la comparaison puisqu'il s'agit dorénavant d'une fonction
    return a < b;
}

function swap(a, i) {
    var temp = a[i];
    a[i] = a[i + 1];
    a[i + 1] = temp;
    return a
}
```
Ce sont les seules modifications à effectuer. De plus, la première n'est pas fondamentale mais il semble utile de pouvoir capturer les branchements conditionnels.
### 3.3. Observer.js
Aucun changement n'est requis.
### 3.4. Teacher.js
Tel quel, Teacher possède déjà les fonctions log, display, updateObjects, play, setText et les classes TItem et Utils. Nous aimerions pouvoir ajouter une nouvelle classe qui permettrait d'afficher un tableau qui serait lié dynamiquement au tableau de l'algorithme de Specialist.js. Par conséquent, nous créons une nouvelle classe TArray qui aura comme paramètres ses valeurs par défaut, un container HTML où il sera affiché et ses listeners.
```js
1.  class TArray extends TItem {
2.     constructor(refArray, container, beforeAction, afterAction) {
3.         super(beforeAction, afterAction);
4.         this.refArray = refArray;
5.         this.screenArray = document.createElement('table');
6.         let row = document.createElement('tr');
7.         for (let i in this.refArray) {
8.             let element = document.createElement('td');
9.             element.innerText = this.refArray[i];
10.            row.appendChild(element);
11.        }
12.        this.screenArray.appendChild(row);
13.        document.getElementById(container).appendChild(this.screenArray);
14.        this.screenArray.classList.add('table');
15.    }
```
A ligne 1, on définit une nouvelle classe nommée TArray qui va étendre la classe TItem et qui héritera par conséquent de ses méthodes.

A la ligne 2, on définit son constructeur avec les paramètres énoncés plus haut, refArray étant un tableau qui contient les valeurs par défaut.

A la ligne 3, On appelle la méthode super qui permet d'inscrire les listeners grâce aux méthodes de TItem.

Ensuite on définit deux attributs : refArray afin d'en garder un trace et screenArray, qui va permettre l'affichage du tableau à l'écran. Les lignes 5 à 12 permettent la création d'une table, l'ajout d'une ligne à celle-ci et le remplissage de cette ligne avec les valeurs de refArray (une balise td signifie "Table Data" et permet de stocker des données). Ensuite on ajoute l'élément HTML ainsi créé au container HTML passé dans le constructeur pour permettre l'affichage du tableau dans la zone HTML indiquée. Enfin on ajoute une classe à la table afin de pouvoir si besoin lui appliquer une feuille de style CSS.

Une fois le constructeur créé, nous allons ajouter deux méthodes : select et updateArray, qui permettront respectivement de "sélectionner" des indices en les colorant et de mettre à jour le tableau avec un nouveau tableau, permettant d'actualiser les valeurs avec celles de l'algorithme.

```js
updateArray(newArr) { // Met à jour refArray et screenArray avec les valeurs de newArr
    this.refArray = newArr;
    let values = this.screenArray.getElementsByTagName('td');
    for (let i in this.refArray) {
        values[i].innerText = this.refArray[i];
    }
}
```
```js
 // Permet de sélectionner et de colorer les indices "indexes". La valeur .selected doit être définie dans une feuille CSS
select(indexes, color) {
    let className = color ? `selected-${color}` : 'selected';
    // Enlève la sélection précédente
    Array.from(this.screenArray.querySelectorAll("[class^=selected]")).forEach(elem => {
        elem.classList.remove('selected', 'selected-red');
    });

    let items = this.screenArray.getElementsByTagName('td');
    if (typeof indexes === 'number') { // On peut avoir passé un seul index ou un tableau
        indexes = [indexes];
    }
    if (indexes.includes(-1)) { // Contrôle d'erreur
        return
    }
    for (let index of indexes) { // On ajoute la classe CSS à chacun des index du tableau
        try {
            items[index].classList.add(className);
        }
        catch (e) { // Gestion d'erreurs éventuelles
            console.log(`indexes : ${indexes}`);
            console.log(e);
        }
    }
}
```
Enfin, pour déclarer les listeners, il suffit d'ajouter les lignes suivantes dans l'encart d'initialisation de display().
```js
static display(shouldGoForward = true) {
  if (_curr != -1) {
      if (shouldGoForward) {
          _curr < (_logs.length - 1) ? _curr += 1 : _curr;
      } else {
          _curr > 0 ? _curr -= 1 : _curr;
      }
  } else {// Init
      // Instanciation de TArray
      new TArray(
          // Valeurs du tableau
          [12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 4891, 455, 23, 234, 213],
          // Conteneur HTML qui contiendra le tableau (défini dans index.html)
          'table',
          // BeforeListeners
          [
              [
                  // Si la fonction swap est appelée, nous voulons colorer les cases échangées en rouge
                  'swap', (that, log) => { 
                      // On utilise that.select car select est une méthode de TArray
                      // log[1] = arguments de la fonction capturée
                      // log[1][n] = n ème argument. Dans le cas de swap on sait qu'il y en a deux 
                      that.select([log[1][1], log[1][1] + 1], 'red');
                  }
              ],
              [
                  // Si la fonction isSmaller est appelée, nous voulons colorer les cases comparées en bleu (couleur par défaut de select)
                  'isSmaller', (that, log) => {
                      // Comme on ne prend pas en compte le sens dans lequel l'algorithme est affiché (si l'utilisateur va vers l'avant ou vers l'arrière), on essaie de trouver dans le tableau un sous tableau qui contient [a,b] et, si échéant, on essaie de trouver [b,a]
                      let index = Utils.findSubArray(that.refArray, log[1]);
                      if (index == -1) { // sous tableau introuvable
                          // On cherche l'inverse du tableau
                          index = Utils.findSubArray(that.refArray, Utils.deepCopy(log[1]).reverse());
                          that.select([index, index + 1]);
                      } else {
                          that.select([index, index + 1]);
                      }
                  }
              ]
          ],
          // AfterListeners
          [
              [
                  // Après que swap a été appelée, on veut mettre à jour le tableau avec les nouvelles valeurs du tableau obtenues après le retour de swap.
                  'swap', (that, log) => { that.updateArray(log[3]) }
              ]
          ]);
      _curr++;
  }
  ...
```
Tout est prêt, il faut maintenant lier les différents éléments dans index.html. De grandes sections ont été omises mais le fichier de demo est complet. Ici ne sont présents que les éléments fondamentaux, entrecoupés de commentaires "<<span>!-- ... -->"
```html
<!-- ... -->

<head>
    <!-- ... -->
    <link rel="stylesheet" href="style.css"> <!-- Ne pas oublier la feuille de style si définie -->
    <title>algorithm explainer</title>
</head>

<body>
    <!-- ... -->
    <!-- Définition des boutons -->
    <button onclick="Teacher.display(false)">Précédent</button>
    <button onclick="Teacher.display(true)">Suivant</button>
    <button id="playButton" class="float-right" onclick="Teacher.play(this.id)">Jouer toute la séquence</button>
    <!-- ... -->
    <!-- Définition des différents conteneurs -->
    <div id="table"></div>
    <div id="display"></div>
    <div id="algorithm"></div>
    <!-- ... -->
    <!-- Appels des scripts, l'ordre est important -->
    <script src="teacher.js"></script>
    <script src="../observer.js"></script>
    <script src="specialist.js"></script>
    <script>
        // Nous voulons un observer qui capture tous les appels de fonctions globales, sans classes spécifiques et en blacklistant "run"
        new Observer(
            [], // Pas de classe spécifique
            [globalThis], // Objet global
            [
                { // Permet le log des fonctions
                    aspect: (...args) => { Teacher.log(args[0], args[1], args[2]) },
                    advice: "before"
                },
                { // Journalise les valeurs de retour des fonctions
                    aspect: (value) => {
                        if (value != undefined) {
                            Teacher.log(value)
                        }
                        else {
                            Teacher.log("undefined")
                        }
                        return value
                    },
                    advice: "afterReturning"
                }
            ],
            ["run"] // run est blacklisté
        ).startObserver(); // Lancement de l'observer
        fetch('specialist.js').then(res => res.text()).then(data => Teacher.setText(data)); // affichage du code complet du spécialiste dans Teacher
        run(); // Lancement du spécialiste
        Teacher.display(); // Une fois que le spécialiste a terminé son travail, on affiche les résultats
    </script>
</body>

</html>
```
