# 1. AlgObserver.js
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2016+-blue?style=?style=plastic&logo=javascript&logoColor=F7DF1E)](https://github.com/PierreBergerat/ProjetBachelor2021) [![HTML](https://img.shields.io/badge/HTML-5-blue?style=?style=plastic&logo=html5)](https://github.com/PierreBergerat/ProjetBachelor2021)

AlgObserver permet d'augmenter des fonctions JavaScript, built-in ou non, avec d'autres fonctions définies par l'utilisateur. Dans l'exemple fourni, l'augmentation des fonctions permet l'ajout d'un outil de journalisation à chacune des fonctions injectées, et autorise ainsi le parcours rétrospectif de ces dernières afin de mieux comprendre le fonctionnement du code.

- [1. AlgObserver.js](#1-algobserverjs)
  - [1.1. Installation](#11-installation)
  - [1.2. Utilisation](#12-utilisation)
    - [1.2.1. Observer.js](#121-observerjs)
      - [1.2.1.1. new Observer(objects, namespaces, functions, blacklist).startObserver()](#1211-new-observerobjects-namespaces-functions-blackliststartobserver)
        - [1.2.1.1.1. objects](#12111-objects)
        - [1.2.1.1.2. namespaces](#12112-namespaces)
        - [1.2.1.1.3. functions](#12113-functions)
          - [1.2.1.1.3.1. advices](#121131-advices)
        - [1.2.1.1.4. blacklist](#12114-blacklist)
        - [1.2.1.1.5. startObserver()](#12115-startobserver)
        - [1.2.1.1.6. Exemple complet d'instanciation d'Observer](#12116-exemple-complet-dinstanciation-dobserver)
      - [1.2.1.2. run()](#1212-run)
    - [Teacher.js](#teacherjs)
      - [Variables globales](#variables-globales)
      - [setText](#settext)
      - [log](#log)
      - [TItem](#titem)
      - [updateObjects](#updateobjects)
      - [display](#display)
      - [play](#play)

## 1.1. Installation
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
## 1.2. Utilisation
### 1.2.1. Observer.js
Observer.js est le point central d'AlgObserver car c'est lui qui permet l'injection des fonctions. Il peut fonctionner seul mais il a été créé avec l'idée d'être joint au programme Teacher.js (voir plus bas). Comme vu plus haut, plusieurs appels de fonctions doivent être effectués pour que le programme fonctionne.
#### 1.2.1.1. new Observer(objects, namespaces, functions, blacklist).startObserver()
  
Cet appel crée une nouvelle instance d'Observer et permet d'injecter les fonctions selon les critères passés en paramètres. Ceux-ci sont, dans l'ordre :
##### 1.2.1.1.1. objects
Tableau des classes à injecter. Pour injecter une classe, il faut indiquer le nom complet de celle-ci. Cet argument attend un tableau même si une seule classe est injectée (ou aucune).
```js
  [] // aucune classe ne sera injectée
  [maClasse] // la classe "maClasse" sera injectée
  [maClasse1, maClasse2, maClasse3] // toutes les classes indiquées seront injectées
```
##### 1.2.1.1.2. namespaces
Tableau des namespaces à injecter. Dans la plupart des cas, on voudra injecter globalThis pour injecter toutes les fonctions globales (c'est-à-dire des fonctions ne faisant pas parties d'objets). Cet argument attend un tableau même si un seul namespace est injecté (ou aucun).
```js
  [] // aucun namespace ne sera injecté
  [globalThis] // le namespace global sera injecté
```
##### 1.2.1.1.3. functions
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
###### 1.2.1.1.3.1. advices
4 advices sont reconnus par observer.js et permettent d'indiquer au programme où injecter la fonction. Les advices sont obligatoirement indiqués par un String représentant leur nom :
- "before" : la fonction injectée s'exécutera avant la fonction à injecter.
- "around" : la fonction injectée s'exécutera avant **et** après la fonction à injecter
- "after" : la fonction injectée s'exécutera après la fonction à injecter
- "afterReturning" : la fonction injectée s'exécutera après la fonction à injecter et ne recevra *que la valeur de retour de la fonction à injecter* en paramètre
##### 1.2.1.1.4. blacklist
Tableau de string contenant les noms des fonctions à ne pas injecter. Cet argument attend un tableau même si un seul string est indiqué (ou aucun).
```js
  [] // aucune fonction n'est retirée de la liste
  ["maFonction"] // la fonction "maFonction" sera blacklistée
  ["maFonction1", "maFonction2", "maFonction3"] // toutes les fonctions indiquées seront blacklistées.
```
##### 1.2.1.1.5. startObserver()
Cette méthode d'Observer permet de commencer l'injection des méthodes. En général, il sera plus utile d'appliquer cette méthode directement à la suite de l'instanciation.
```js
new Observer([],
            [globalThis],
            [{aspect: (...args) => { console.log(args[0], args[1], args[2])}, advice: "before"}],
            []
        ).startObserver(); // Démarrage immédiat de l'injection des fonctions
```
##### 1.2.1.1.6. Exemple complet d'instanciation d'Observer
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
#### 1.2.1.2. run()
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
### Teacher.js
Teacher.js permet, grâce à ses différentes fonctions, d'afficher de façon dynamique les données lues par l'Observer et a été créé dans ce but. En effet, bien qu'Observer n'ait pas besoin de Teacher pour fonctionner, l'utilisation jointe des outils permet d'ajouter une dimension pédagogique au code observé par le biai d'outils visuels. Ci-dessous sont expliquées les différentes méthodes implémentées par défaut dans le Teacher, ainsi qu'une explication sur la façon d'ajouter de nouveaux outils. Dans sa conception, Teacher est fait pour être modifié et adapté aux besoins de l'utilisateur mais il fournit une structure de base qui pourra être agrémentée de nouvelles fonctionnalités ou servir de base pour un script personnalisé similaire.
#### Variables globales
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
#### setText
#### log
#### TItem
#### updateObjects
#### display
#### play