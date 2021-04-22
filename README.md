# AlgObserver.js
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES2016+-blue?style=?style=plastic&logo=javascript&logoColor=F7DF1E)]() [![HTML](https://img.shields.io/badge/HTML-5-blue?style=?style=plastic&logo=html5)]() [![Bootstrap](https://img.shields.io/badge/Bootstrap-5.0-blue?style=?style=plastic&logo=bootstrap)]()

## Table des matières
- [AlgObserver.js](#algobserverjs)
  - [Table des matières](#table-des-matières)
  - [1. Présentation](#1-présentation)
    - [1.1 Structure du répertoire](#11-structure-du-répertoire)
    - [1.2 Technologies employées](#12-technologies-employées)
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
### 1.1 Structure du répertoire
```js
📦 Javascript Aspect Oriented Programming
 ┣ 📜index.html // Structure de la page Web
 ┣ 📜observer.js // Enregistre chaque appel de fonction de l'algorithme
 ┣ 📜specialist.js // Algorithme visant à résoudre une tâche
 ┗ 📜teacher.js // Met en page et affiche les données enregistrées
 ```
### 1.2 Technologies employées
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/) (via [CDN](https://fr.wikipedia.org/wiki/R%C3%A9seau_de_diffusion_de_contenu))
- [JavaScript ECMA2021](https://kangax.github.io/compat-table/es2016plus/) ([Voir table de compatibilité JavaScript 2016+](https://kangax.github.io/compat-table/es2016plus/))
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

### 3.1 WorkFlow

## 4. Todo

- [x] Présentation
- [x] Documentation
- [ ] Ajout de structures de données supplémentaires
- [ ] Tests supplémentaires
### 4.1 Optionnel
- [ ] Gestion d'algorithmes asynchrones (fetch(), setTimeout(), ...)