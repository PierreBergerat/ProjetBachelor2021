// Exemple d'utilisation du framework
let algo = new Algorithm("Naive_Bayes");
algo.createTable('container'); //vecteur de propriétés
const run = () => {
    algo.addTask(new Task('Calculer l\'entropie de la colonne d\'observation',
        'On va utiliser la formule vue en cours pour calculer l\'entropie',
        [
            (values) => {
                return Array.from(new Set(algo.table.filterData((e, x, y) => { return x == algo.table.cols - 1 && y != 0 }).map(x => { return x.value })));
            },
            (values) => {
                console.log('il existe deux valeurs pour la dernière colonne,', values[0], 'et', values[1]);
                return values;
            },
            (values) => {
                return algo.table.filterData((e, x, y) => { return e == values[0] && x == algo.table.cols - 1 && y != 0 });
            },
            (values) => {
                return Utils.calculateEntropy(values, algo.table.rows - 1)
            }
        ]
    )
    )
}