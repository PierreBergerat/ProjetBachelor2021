// Exemple d'utilisation du framework
let algo = new Algorithm("Decision_Tree");
algo.createTable('container'); //vecteur de propriétés
const run = () => {
    algo.addTask(new Task('Calculer l\'entropie de la colonne d\'observation',
        'On va utiliser la formule vue en cours pour calculer l\'entropie',
        [
            (values) => {
                algo.display("Tout d'abord je vais observer les différents labels possibles", 0);
                return Array.from(new Set(algo.table.filterData((e, x, y) => { return x == algo.table.cols - 1 && y != 0 }).map(x => { return x.value })));
            },
            (values) => {
                algo.display('il existe deux valeurs pour la dernière colonne, ' + values[0] + ' et ' + values[1], 1);
                return values;
            },
            (values) => {
                algo.display('Ensuite je vais compter le nombre de chacunes de ces valeurs, en commençant par ' + values[0], 0)
                return algo.table.filterData((e, x, y) => { return e == values[0] && x == algo.table.cols - 1 && y != 0 });
            },
            (values) => {
                algo.display('Il y en a ' + values.length + '. Je vais maintenant calculer l\'entropie de ' + algo.table.data[0][algo.table.cols - 1] + ' par rapport aux nombres de cas totaux, qui sont au nombre de ' + (algo.table.rows - 1), 1)
                return Utils.calculateEntropy(values, algo.table.rows - 1)
            }
        ]
    ))
    for (let i = 0; i < algo.tasks.length; i++) {
        console.log('Nom : ', algo.tasks[i].name);
        console.log('Description : ', algo.tasks[i].description);
        console.log('Résultat : ', algo.tasks[i].play(algo.tasks[i].actions));
    }
}