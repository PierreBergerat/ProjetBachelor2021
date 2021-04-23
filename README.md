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
    - [2.3 Teacher.js](#23-teacherjs)
    - [2.4 Index.html](#24-indexhtml)
  - [3. Fonctionnement](#3-fonctionnement)
    - [3.1 WorkFlow](#31-workflow)
  - [4. Todo](#4-todo)
    - [4.1 Optionnel](#41-optionnel)

## 1. Présentation

AlgObserver est un outil JavaScript permettant la capture des appels de fonctions des scripts exécutés sur la même page sans que ces derniers aient à être modifiés. Inspiré des concepts de l'Aspect Oriented Programming (AOP), AlgObserver permet "l'augmentation" des fonctions et des méthodes en injectant du code directement dans leur prototype. Ainsi, il est possible d'ajouter une méthode de journalisation des appels de fonctions mais le concept peut également être utilisé pour altérer complètement le fonctionnement d'un script en modifiant les valeurs de retours, les opérations effectuées sur les arguments ou encore d'ajouter de nouvelles méthodes aux objets ([également sur les objets prédéfinis par JavaScript](https://www.oreilly.com/library/view/javascript-the-good/9780596517748/ch04s07.html)).
### 1.1 Concept
Conceptuellement, le programme fonctionne comme suit:

On imagine un spécialiste dans un domaine en train de travailler (ex : un ouvrier, un ingénieur, ...). L'entreprise dans laquelle il travaille a accepté qu'un reportage soit fait sur lui afin de pouvoir documenter et partager son savoir mais à condition que celui-ci ne soit pas dérangé pendant son service (on implique ici que le code du [Specialist](#21-specialistjs) ne doit pas être modifié). Le journaliste (l'[Observer](#22-observerjs)), va alors pouvoir observer tout ce qu'il fait et journaliser chacune de ses actions. A partir de ces notes, un professeur d'université (le [Teacher](#23-teacherjs)), va pouvoir enseigner les manoeuvres effectuées par le spécialiste afin d'expliquer ce qu'il fait ainsi que pourquoi et comment il le fait.

[Index.html](#24-indexhtml) agit comme le coordinateur des fichiers JavaScript et permet l'exécution de code de façon séquencée en plus de permettre l'affichage, il n'a donc pas de sens au niveau purement conceptuel.

[![](https://mermaid.ink/img/eyJjb2RlIjoiJSV7aW5pdDogeyAndGhlbWUnOiAnZm9yZXN0Jywnc2VxdWVuY2VEaWFncmFtJzoge1xuJ2N1cnZlJzogJ2xpbmVhcicsJ3JpZ2h0QW5nbGVzJzonVHJ1ZSdcbn19IH0lJVxuc2VxdWVuY2VEaWFncmFtXG4gICAgcGFydGljaXBhbnQgU3BlY2lhbGlzdC5qc1xuICAgIHBhcnRpY2lwYW50IE9ic2VydmVyLmpzXG4gICAgcGFydGljaXBhbnQgVGVhY2hlci5qc1xuICAgIHBhcnRpY2lwYW50IEluZGV4Lmh0bWxcbiAgICBJbmRleC5odG1sLT4-T2JzZXJ2ZXIuanM6IGluamVjdChPYmpldCBuYW1lU3BhY2UpXG4gICAgSW5kZXguaHRtbC0-PlNwZWNpYWxpc3QuanM6IHJ1bigpXG4gICAgYWN0aXZhdGUgU3BlY2lhbGlzdC5qc1xuICAgIFNwZWNpYWxpc3QuanMtPj5PYnNlcnZlci5qczogYXBwZWxGb25jdGlvbihhcmdzKVxuICAgIGFjdGl2YXRlIE9ic2VydmVyLmpzXG4gICAgYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICBPYnNlcnZlci5qcy0-PlRlYWNoZXIuanM6IGxvZyhhcHBlbEZvbmN0aW9uLFwiYXBwZWxGb25jdGlvblwiLGFyZ3MpXG4gICAgYWN0aXZhdGUgVGVhY2hlci5qc1xuICAgIFRlYWNoZXIuanMtPj5UZWFjaGVyLmpzOiBsb2dzLnB1c2gobG9nKVxuICAgIFRlYWNoZXIuanMtLT4-T2JzZXJ2ZXIuanM6IFxuICAgIGRlYWN0aXZhdGUgVGVhY2hlci5qc1xuICAgIG9wdCBtb2RpZmljYXRpb24gZGUgbGEgdmFsZXVyIHJldG91cm7DqWVcbiAgICAgICAgYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICAgICAgT2JzZXJ2ZXIuanMtPj5PYnNlcnZlci5qczogdmFsZXVyID0gbm91dmVsbGVWYWxcbiAgICAgICAgZGVhY3RpdmF0ZSBPYnNlcnZlci5qc1xuICAgIGVuZFxuICAgIGRlYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICBPYnNlcnZlci5qcy0tPj5TcGVjaWFsaXN0LmpzOiByZXRvdXJuZSB2YWxldXJcbiAgICBkZWFjdGl2YXRlIE9ic2VydmVyLmpzXG4gICAgZGVhY3RpdmF0ZSBTcGVjaWFsaXN0LmpzXG4gICAgSW5kZXguaHRtbC0-PlRlYWNoZXIuanM6IGRpc3BsYXkoKSIsIm1lcm1haWQiOnt9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiJSV7aW5pdDogeyAndGhlbWUnOiAnZm9yZXN0Jywnc2VxdWVuY2VEaWFncmFtJzoge1xuJ2N1cnZlJzogJ2xpbmVhcicsJ3JpZ2h0QW5nbGVzJzonVHJ1ZSdcbn19IH0lJVxuc2VxdWVuY2VEaWFncmFtXG4gICAgcGFydGljaXBhbnQgU3BlY2lhbGlzdC5qc1xuICAgIHBhcnRpY2lwYW50IE9ic2VydmVyLmpzXG4gICAgcGFydGljaXBhbnQgVGVhY2hlci5qc1xuICAgIHBhcnRpY2lwYW50IEluZGV4Lmh0bWxcbiAgICBJbmRleC5odG1sLT4-T2JzZXJ2ZXIuanM6IGluamVjdChPYmpldCBuYW1lU3BhY2UpXG4gICAgSW5kZXguaHRtbC0-PlNwZWNpYWxpc3QuanM6IHJ1bigpXG4gICAgYWN0aXZhdGUgU3BlY2lhbGlzdC5qc1xuICAgIFNwZWNpYWxpc3QuanMtPj5PYnNlcnZlci5qczogYXBwZWxGb25jdGlvbihhcmdzKVxuICAgIGFjdGl2YXRlIE9ic2VydmVyLmpzXG4gICAgYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICBPYnNlcnZlci5qcy0-PlRlYWNoZXIuanM6IGxvZyhhcHBlbEZvbmN0aW9uLFwiYXBwZWxGb25jdGlvblwiLGFyZ3MpXG4gICAgYWN0aXZhdGUgVGVhY2hlci5qc1xuICAgIFRlYWNoZXIuanMtPj5UZWFjaGVyLmpzOiBsb2dzLnB1c2gobG9nKVxuICAgIFRlYWNoZXIuanMtLT4-T2JzZXJ2ZXIuanM6IFxuICAgIGRlYWN0aXZhdGUgVGVhY2hlci5qc1xuICAgIG9wdCBtb2RpZmljYXRpb24gZGUgbGEgdmFsZXVyIHJldG91cm7DqWVcbiAgICAgICAgYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICAgICAgT2JzZXJ2ZXIuanMtPj5PYnNlcnZlci5qczogdmFsZXVyID0gbm91dmVsbGVWYWxcbiAgICAgICAgZGVhY3RpdmF0ZSBPYnNlcnZlci5qc1xuICAgIGVuZFxuICAgIGRlYWN0aXZhdGUgT2JzZXJ2ZXIuanNcbiAgICBPYnNlcnZlci5qcy0tPj5TcGVjaWFsaXN0LmpzOiByZXRvdXJuZSB2YWxldXJcbiAgICBkZWFjdGl2YXRlIE9ic2VydmVyLmpzXG4gICAgZGVhY3RpdmF0ZSBTcGVjaWFsaXN0LmpzXG4gICAgSW5kZXguaHRtbC0-PlRlYWNoZXIuanM6IGRpc3BsYXkoKSIsIm1lcm1haWQiOnt9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)
Dans l'ordre, on a :

1. L'[Observer](#22-observerjs) injecte le ou les namespace(s) désiré(s), la configuration actuelle étant l'injection de [globalThis](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/globalThis) qui permet l'injection de toutes les fonctions nommées dites "globales", c'est-à-dire les fonctions qui ne sont ni des sous-fonctions (fonctions dans des fonctions), ni des méthodes de classe, ni des fonctions anonymes (fonction de forme **()=>{}**). Il est également possible d'utiliser la fonction d'injection "inject" sur les prototypes de classes afin de pouvoir injecter leurs méthodes (voir [Fonctionnement](#3-fonctionnement)).

1. Une fois les méthodes injectées, l'algorithme défini dans le [Specialist](#21-specialistjs)
### 1.2 Structure du répertoire
```js
📦 Javascript Aspect Oriented Programming
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
Le spécialiste contient un/des algorithme(s) (ici Bubble sort) dont les appels de fonctions vont être capturés par l'[observer](#22-observerjs). La taille et la complexité de ce(s) dernier(s) n'ont a priori pas d'incidence sur le déroulement des événements.
>Les algorithmes présents dans le spécialiste n'ont aucune dépendance vis à vis de l'[observer](#22-observerjs) et du [teacher](#23-teacherjs), si ce n'est que son exécution doit se faire après l'exécution de la fonction 
startObserver() (cf. [Index.html](#24-indexhtml)).
```html
<!--Index.html [ln 40]-->
<script>
    startObserver(); // Géré par Observer.js (cf. plus bas)
    run(); // Fonction permettant de lancer l'algorithme présent dans specialist.js
    display(); // Affichage des résultats de la capture par teacher.js (cf. plus bas)
</script>
```
### 2.2 Observer.js

### 2.3 Teacher.js

### 2.4 Index.html

## 3. Fonctionnement
```js
// observer.js [Ln 6]
const getMethods = (prototype) => {...}

// observer.js [Ln 44]
function inject(target, aspect, advice) {
  const methods = getMethods(target);
  ...
}
```
```js
// Exemples d'injection de classes :

// Injecte la classe "Test"
inject(Test.prototype, loggingAspect, "before");
inject(Test.prototype, loggingReturnedValueAspect, "afterReturning");

// Injecte l'objet global "Math". Permet de journaliser Math.pow(), Math.exp(), etc.
inject(Math, loggingAspect, "before");
inject(Math, loggingReturnedValueAspect, "afterReturning");

//Injecte l'objet global "document". Permet de journaliser document.querySelector, document.getElementsById(), etc.
inject(document, loggingAspect, "before");
inject(document, loggingReturnedValueAspect, "afterReturning");
```
### 3.1 WorkFlow

## 4. Todo

- [x] Présentation
- [x] Documentation
- [ ] Ajout de structures de données supplémentaires
- [ ] Tests supplémentaires
### 4.1 Optionnel
- [ ] Gestion d'algorithmes asynchrones (fetch(), setTimeout(), ...)