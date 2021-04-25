# AlgObserver.js
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES2016+-blue?style=?style=plastic&logo=javascript&logoColor=F7DF1E)]() [![HTML](https://img.shields.io/badge/HTML-5-blue?style=?style=plastic&logo=html5)]() [![Bootstrap](https://img.shields.io/badge/Bootstrap-5.0-blue?style=?style=plastic&logo=bootstrap)]()
## Table des matières
- [AlgObserver.js](#algobserverjs)
  - [Table des matières](#table-des-matières)
  - [1. Présentation](#1-présentation)
    - [1.1 Concept](#11-concept)
    - [1.2 Structure du répertoire](#12-structure-du-répertoire)
    - [1.3 Technologies employées](#13-technologies-employées)
  - [2. Composants](#2-composants)
    - [2.1 Specialist.js](#21-specialistjs)
    - [2.2 Observer.js](#22-observerjs)
      - [2.2.1 Aspects](#221-aspects)
      - [2.2.2 Advices](#222-advices)
    - [2.3 Teacher.js](#23-teacherjs)
    - [2.4 Index.html](#24-indexhtml)
  - [3. Fonctionnement](#3-fonctionnement)
    - [3.1 Injections](#31-injections)
    - [3.2 TItem](#32-titem)
    - [3.3 UpdateObjects](#33-updateobjects)
    - [3.4 Display](#34-display)
  - [4. Todo](#4-todo)
    - [4.1 Optionnel](#41-optionnel)
## 1. Présentation
AlgObserver est un outil JavaScript permettant la capture des appels de fonctions des scripts exécutés sur la même page sans que ces derniers aient à être modifiés. Inspiré des concepts de l'Aspect Oriented Programming (AOP), AlgObserver permet "l'augmentation" des fonctions et des méthodes en injectant du code directement dans leur prototype. Ainsi, il est possible d'ajouter une méthode de journalisation des appels de fonctions mais le concept peut également être utilisé pour altérer complètement le fonctionnement d'un script en modifiant les valeurs de retours, les opérations effectuées sur les arguments ou encore d'ajouter de nouvelles méthodes aux objets ([également sur les objets prédéfinis par JavaScript](https://www.oreilly.com/library/view/javascript-the-good/9780596517748/ch04s07.html)).
### 1.1 Concept
Conceptuellement, le programme fonctionne comme suit:<br>
On imagine un spécialiste dans un domaine en train de travailler (ex : un ouvrier, un ingénieur, ...). L'entreprise dans laquelle il travaille a accepté qu'un reportage soit fait sur lui afin de pouvoir documenter et partager son savoir mais à condition que celui-ci ne soit pas dérangé pendant son service (on implique ici que le code du [Specialist](#21-specialistjs) ne doit pas être modifié). Le journaliste (l'[Observer](#22-observerjs)), va alors pouvoir observer tout ce qu'il fait et journaliser chacune de ses actions. A partir de ces notes, un professeur d'université (le [Teacher](#23-teacherjs)), va pouvoir enseigner les manoeuvres effectuées par le spécialiste afin d'expliquer ce qu'il fait ainsi que pourquoi et comment il le fait.<br>
[Index.html](#24-indexhtml) agit comme le coordinateur des fichiers JavaScript et permet l'exécution de code de façon séquencée en plus de permettre l'affichage, il n'a donc pas de sens au niveau purement conceptuel.

[![](https://mermaid.ink/img/eyJjb2RlIjoiJSV7aW5pdDogeyAndGhlbWUnOiAnZm9yZXN0Jywnc2VxdWVuY2VEaWFncmFtJzoge1xuJ2N1cnZlJzogJ2xpbmVhcicsJ3JpZ2h0QW5nbGVzJzonVHJ1ZSdcbn19IH0lJVxuc2VxdWVuY2VEaWFncmFtXG4gICAgcGFydGljaXBhbnQgU3BlY2lhbGlzdC5qc1xuICAgIHBhcnRpY2lwYW50IE9ic2VydmVyLmpzXG4gICAgcGFydGljaXBhbnQgVGVhY2hlci5qc1xuICAgIHBhcnRpY2lwYW50IEluZGV4Lmh0bWxcbiAgICBJbmRleC5odG1sLT4-T2JzZXJ2ZXIuanM6IGluamVjdChPYmpldCBuYW1lU3BhY2UpXG4gICAgSW5kZXguaHRtbC0-PlNwZWNpYWxpc3QuanM6IHJ1bigpXG4gICAgYWN0aXZhdGUgU3BlY2lhbGlzdC5qc1xuICAgIFNwZWNpYWxpc3QuanMtPj5PYnNlcnZlci5qczogYXBwZWxGb25jdGlvbihhcmdzKVxuICAgIGFjdGl2YXRlIE9ic2VydmVyLmpzXG4gICAgYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICBPYnNlcnZlci5qcy0-PlRlYWNoZXIuanM6IGxvZyhhcHBlbEZvbmN0aW9uLFwiYXBwZWxGb25jdGlvblwiLGFyZ3MpXG4gICAgYWN0aXZhdGUgVGVhY2hlci5qc1xuICAgIFRlYWNoZXIuanMtPj5UZWFjaGVyLmpzOiBsb2dzLnB1c2gobG9nKVxuICAgIFRlYWNoZXIuanMtLT4-T2JzZXJ2ZXIuanM6IFxuICAgIGRlYWN0aXZhdGUgVGVhY2hlci5qc1xuICAgIG9wdFxuICAgICAgICBhY3RpdmF0ZSBPYnNlcnZlci5qc1xuICAgICAgICBPYnNlcnZlci5qcy0-Pk9ic2VydmVyLmpzOiB2YWxldXIgPSBub3V2ZWxsZVZhbFxuICAgICAgICBkZWFjdGl2YXRlIE9ic2VydmVyLmpzXG4gICAgZW5kXG4gICAgZGVhY3RpdmF0ZSBPYnNlcnZlci5qc1xuICAgIE9ic2VydmVyLmpzLS0-PlNwZWNpYWxpc3QuanM6IHJldG91cm5lIHZhbGV1clxuICAgIGRlYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICBkZWFjdGl2YXRlIFNwZWNpYWxpc3QuanNcbiAgICBsb29wXG4gICAgSW5kZXguaHRtbC0-PlRlYWNoZXIuanM6IGRpc3BsYXkoKVxuICAgIGVuZCIsIm1lcm1haWQiOnt9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiJSV7aW5pdDogeyAndGhlbWUnOiAnZm9yZXN0Jywnc2VxdWVuY2VEaWFncmFtJzoge1xuJ2N1cnZlJzogJ2xpbmVhcicsJ3JpZ2h0QW5nbGVzJzonVHJ1ZSdcbn19IH0lJVxuc2VxdWVuY2VEaWFncmFtXG4gICAgcGFydGljaXBhbnQgU3BlY2lhbGlzdC5qc1xuICAgIHBhcnRpY2lwYW50IE9ic2VydmVyLmpzXG4gICAgcGFydGljaXBhbnQgVGVhY2hlci5qc1xuICAgIHBhcnRpY2lwYW50IEluZGV4Lmh0bWxcbiAgICBJbmRleC5odG1sLT4-T2JzZXJ2ZXIuanM6IGluamVjdChPYmpldCBuYW1lU3BhY2UpXG4gICAgSW5kZXguaHRtbC0-PlNwZWNpYWxpc3QuanM6IHJ1bigpXG4gICAgYWN0aXZhdGUgU3BlY2lhbGlzdC5qc1xuICAgIFNwZWNpYWxpc3QuanMtPj5PYnNlcnZlci5qczogYXBwZWxGb25jdGlvbihhcmdzKVxuICAgIGFjdGl2YXRlIE9ic2VydmVyLmpzXG4gICAgYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICBPYnNlcnZlci5qcy0-PlRlYWNoZXIuanM6IGxvZyhhcHBlbEZvbmN0aW9uLFwiYXBwZWxGb25jdGlvblwiLGFyZ3MpXG4gICAgYWN0aXZhdGUgVGVhY2hlci5qc1xuICAgIFRlYWNoZXIuanMtPj5UZWFjaGVyLmpzOiBsb2dzLnB1c2gobG9nKVxuICAgIFRlYWNoZXIuanMtLT4-T2JzZXJ2ZXIuanM6IFxuICAgIGRlYWN0aXZhdGUgVGVhY2hlci5qc1xuICAgIG9wdFxuICAgICAgICBhY3RpdmF0ZSBPYnNlcnZlci5qc1xuICAgICAgICBPYnNlcnZlci5qcy0-Pk9ic2VydmVyLmpzOiB2YWxldXIgPSBub3V2ZWxsZVZhbFxuICAgICAgICBkZWFjdGl2YXRlIE9ic2VydmVyLmpzXG4gICAgZW5kXG4gICAgZGVhY3RpdmF0ZSBPYnNlcnZlci5qc1xuICAgIE9ic2VydmVyLmpzLS0-PlNwZWNpYWxpc3QuanM6IHJldG91cm5lIHZhbGV1clxuICAgIGRlYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICBkZWFjdGl2YXRlIFNwZWNpYWxpc3QuanNcbiAgICBsb29wXG4gICAgSW5kZXguaHRtbC0-PlRlYWNoZXIuanM6IGRpc3BsYXkoKVxuICAgIGVuZCIsIm1lcm1haWQiOnt9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)
1. L'[Observer](#22-observerjs) injecte le ou les namespace(s) désiré(s), la configuration actuelle étant l'injection de [globalThis](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/globalThis) qui permet l'injection de toutes les fonctions nommées dites "globales", c'est-à-dire les fonctions qui ne sont ni des sous-fonctions (fonctions dans des fonctions), ni des méthodes de classe, ni des fonctions anonymes (fonction de forme **()=>{}**). Il est également possible d'utiliser la fonction d'injection "inject" sur les prototypes de classes afin de pouvoir injecter leurs méthodes (voir [Fonctionnement](#3-fonctionnement)).
2. Une fois les méthodes injectées, l'algorithme défini dans le [Specialist](#21-specialistjs) est exécuté et chacun des appels de fonctions globales et des objets injectés sont capturés par l'[Observer](#22-observerjs) et journalisés par le [Teacher](#23-teacherjs).
3. L'exécution de l'algorithme terminée, [Index](#24-indexhtml) affiche les résultats à l'écran. Il est alors possible d'avancer et de reculer pour observer les différentes opérations effectuées lors de l'exécution du [Specialist](#21-specialistjs).
### 1.2 Structure du répertoire
```js
📦 AlgObserver.js
 ┣ 📜index.html // Structure de la page Web
 ┣ 📜observer.js // Enregistre chaque appel de fonction de l'algorithme
 ┣ 📜specialist.js // Algorithme visant à résoudre une tâche
 ┗ 📜teacher.js // Met en page et affiche les données enregistrées
 ```
### 1.3 Technologies employées
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/) (via [CDN](https://fr.wikipedia.org/wiki/R%C3%A9seau_de_diffusion_de_contenu))
- JavaScript ECMA2016+ ([Voir table de compatibilité JavaScript 2016+](https://kangax.github.io/compat-table/es2016plus/))
- HTML5
## 2. Composants
### 2.1 Specialist.js
Le [Specialist](#21-specialistjs) contient un/des algorithme(s) (ici Bubble sort) dont les appels de fonctions vont être capturés par l'[Observer](#22-observerjs). La taille et la complexité de ce(s) dernier(s) n'ont a priori pas d'incidence sur le déroulement des événements.
>Les algorithmes présents dans le spécialiste n'ont aucune dépendance vis à vis de l'[Observer](#22-observerjs) et du [Teacher](#23-teacherjs), si ce n'est que son exécution doit se faire après l'exécution de la fonction 
**startObserver** (cf. [Index](#24-indexhtml)).
```html
<!--Index.html [ln 40]-->
<script>
    startObserver(); // Géré par Observer.js (cf. plus bas)
    run(); // Fonction permettant de lancer l'algorithme présent dans specialist.js
    display(); // Affichage des résultats de la capture par teacher.js (cf. plus bas)
</script>
```
### 2.2 Observer.js
L'[Observer](#22-observerjs) implémente les concepts AOP à proprement parler. Par ses méthodes **inject** et **injectNamespace**, il permet l'injection d'aspects dans les fonctions passées en paramètres ou dans un namespace. L'augmentation en tant que telle est réalisée dans la fonction **replaceMethod**, où elle se verra être redéfinie selon les aspects et greffons (advices) passés en paramètres.
#### 2.2.1 Aspects
Il s'agit de la fonction qui va venir ce greffer à celle indiquée comme target. Dans l'exemple donné, deux aspects sont utilisés :
- loggingAspect : envoie les arguments et les informations de la fonction actuellement exécutée à [Teacher](#23-teacherjs).
- loggingReturnedValueAspect : envoie la valeur de retour de la fonction actuellement exécutée à [Teacher](#23-teacherjs).

Il est bien évidemment possible de modifier ces fonctions ainsi que d'en ajouter des nouvelles. De plus, comme dans le cas d'un aspect passé avec l'advice "afterReturning" la valeur de retour est aussi passée en paramètre, il est possible de la modifier et donc de changer la façon dont la fonction va fonctionner.
#### 2.2.2 Advices
Il s'agit de l'endroit où l'aspect va être inséré. Il existe actuellement 4 advices.
- before : l'aspect sera exécuté *avant* la fonction augmentée.
- around : l'aspect sera exécuté *avant* ***et*** *après* la fonction augmentée.
- after : l'aspect sera exécuté *après* la fonction augmentée.
- afterReturning : l'aspect sera exécuté *après* la fonction augmentée et ne recevra que la valeur de retour de la fonction augmentée en paramètre.
### 2.3 Teacher.js
Le [Teacher](#23-teacherjs) reçoit dans sa fonction **log** tous les appels de fonctions effectués par [Specialist](#21-specialistjs) et les enregistre dans un tableau de tableau de forme
```js
logs = [
    ["nomFonction0", "argsFonction0", "codeFonction0", "valeurRetourFonction0"],
    ["nomFonction1", "argsFonction1", "codeFonction1", "valeurRetourFonction1"],
    ...
]
```
qui va permettre de parcourir les appels dans l'ordre grâce à un itérateur nommé **curr**. Ce fichier possède de plus les fonctions [display](#34-display) et [updateObjects]() qui permettent un affichage dynamique et personnalisé. Ces fonctions sont détaillées plus bas.
### 2.4 Index.html
[Index](#24-indexhtml) permet l'affichage de la page et coordonne les appels de fonctions envoyés aux différents autres fichiers.
## 3. Fonctionnement
### 3.1 Injections
Les injections sont définies avec les fonctions présentes ci-dessous. Celles-ci seront effectuées dès l'appel de la méthode **startObserver**, qui doit les contenir (voir observer.js [Ln 93]).
```js
/* Exemples d'injection de namespace (voir observer.js [Ln 93]).*/
/* Dans la configuration actuelle, toutes les méthodes contenues dans le namespace sont augmentée avec loggingAspect, "before" et loggingReturnedValueAspect, "afterReturning" (voir plus haut).*/

// Injecte le namespace globalThis
injectNamespace(globalThis);

// Exemples d'injection de classes

// Injecte la classe "Test"
inject(Test.prototype, loggingAspect, "before");
inject(Test.prototype, loggingReturnedValueAspect, "afterReturning");

// Injecte l'objet global "Math". Permet de journaliser Math.pow(), Math.exp(), etc.
inject(Math, loggingAspect, "before");
inject(Math, loggingReturnedValueAspect, "afterReturning");

// Injecte l'objet global "document". Permet de journaliser document.querySelector, document.getElementsById(), etc.
inject(document, loggingAspect, "before");
inject(document, loggingReturnedValueAspect, "afterReturning");
```
### 3.2 TItem
La classe **TItem** définie dans le [Teacher](#23-teacherjs) permet, par son extension, d'implémenter un système d'écouteur d'évènements. En effet, chaque classe étendant TItem (via *extends TItem*) devra impérativement appeler sa méthode **super** avec les paramètres indiquant les "Before" et "After" listeners.
Ces derniers sont de forme :
```js
[
  ['nomDeLaFonction', (that, log, isGoingForward) => {}],
  ['nomDeLaFonction', (that, log, isGoingForward) => {}]
]
```
soit un tableau de tableau de deux éléments organisés sont :
1. {String} nomDeLaFonction - Le nom de la fonction à écouter (ex : "bubbleSort").
1. Une fonction anonyme (de forme **()=>{}**) avec comme paramètres optionnels :
   1. {Object} that - l'objet sur lequel le listener est appliqué, c'est-à-dire une instance d'une classe étendant TItem (par exemple TArray). On peut se servir de cet argument pour utiliser des méthodes internes à l'objet utiliser, par exemple la méthode **select** définie dans TArray.
   2. {Array} log - l'appel de fonction construit [comme expliqué précédemment](#23-teacherjs).
   3. {Boolean} isGoingForward - indique si la lecture du log courant se faire vers l'avant ou vers l'arrière (log suivant ou précédent). Plus généralement, ce booléen aura toujours la même valeur que celui passé en paramètres à **display**.

Il est à noter que le nom des paramètres est ici complètement libre puisque les arguments seront toujours passés en paramètres dans le même ordre. Dès lors, on peut également se servir de la flexibilité inhérente aux fonctions JavaScript pour passer moins d'arguments selon les besoins.
```js
/* Exemples d'utilisations valides des Listeners */

/*Les trois fonctions ci-dessous produiront le même résultat*/
['bubbleSort', (that, log, isGoingForward) => {console.log(that)}]
['bubbleSort', (that) => {console.log(that)}]
['bubbleSort', (a) => {console.log(a)}]
```
Un cas pratique d'utilisation est disponible dans le [Teacher](#23-teacherjs).
```js
// teacher.js [Ln 200]
...
new TArray(..., ...,
            [
                [// Exécute la méthode display définie dans TArray lorsque swap est à l'écran
                    'swap', (that, log) => {
                        that.select([log[1][1], log[1][1] + 1], 'red');
                    }
                ],
                [// Exécute la fonction indiquée lorsque isSmaller est à l'écran
                    'isSmaller', (that, log) => {
                        let index = Utils.findSubArray(that.refArray, log[1]);
                        if (index == -1) {
                            index = Utils.findSubArray(that.refArray, Utils.deepCopy(log[1]).reverse());
                            that.select([index, index + 1]);
                        } else {
                            that.select([index, index + 1]);
                        }
                    }
                ]
            ],
            [
                [// Exécute la méthode updateArray définie dans TArray après que swap a été affiché
                    'swap', (that, log) => { that.updateArray(log[3]) }
                ],
                [// Exécute la méthode displayArray définie dans TArray après que isSmaller a été affiché
                    'isSmaller', 'displayArray'
                ]
            ]);
...
```
On remarque que deux tableaux sont passés en arguments et que **super** prend également deux arguments. Le premier permet d'indiquer les fonctions qui devront être exécutée lorsque la fonction exécutée dans le log courant est affichée à l'écran et le second indique les fonctions qui devront être exécuté si la fonction exécutée dans le log précédent était celle indiquée en paramètres.
### 3.3 UpdateObjects
### 3.4 Display
## 4. Todo
✅ Présentation<br>
✅ Documentation<br>
⬜ Ajout de structures de données supplémentaires<br>
⬜ Tests supplémentaires
### 4.1 Optionnel
⬜ Gestion d'algorithmes asynchrones (fetch(), setTimeout(), ...)<br>