// Exemple d'utilisation du framework
let algo = new Algorithm("Decision_Tree");
algo.createTable('container'); //vecteur de propriétés
algo.createExplications('explications')
const run = () => {
    algo.addTask(new Task('Calculer l\'entropie de la colonne d\'observation',
        'On va utiliser la formule vue en cours pour calculer l\'entropie',
        [
            (values) => {
                algo.display("Tout d'abord je vais observer les différents labels possibles", 0);
                return {
                    labels:
                        Array.from(new Set(algo.table.filterData((e, x, y) => { return x == algo.table.cols - 1 && y != 0 }).map(x => { return x.value })))
                };
            },
            (values) => {
                algo.display('il existe deux valeurs pour la dernière colonne, ' + values.labels[0] + ' et ' + values.labels[1], 1);
                return values;
            },
            (values) => {
                algo.display('Ensuite je vais compter le nombre de chacunes de ces valeurs, en commençant par ' + values.labels[0], 0)
                return {
                    nbLabels: {
                        [values.labels[0]]:
                            algo.table.filterData((e, x, y) => { return e == values.labels[0] && x == algo.table.cols - 1 && y != 0 }).length
                    }
                };
            },
            (values) => {
                algo.display('Il y en a ' + values.nbLabels[values.labels[0]] + '. Je vais maintenant calculer l\'entropie de ' + algo.table.data[0][algo.table.cols - 1] + ' par rapport aux nombres de cas totaux, qui sont au nombre de ' + (algo.table.rows - 1), 1)
                return {
                    entropy: {
                        [algo.table.data[0][algo.table.cols - 1]]:
                            Utils.calculateEntropy(values.nbLabels[values.labels[0]], algo.table.rows - 1)
                    }
                }
            }
        ]
    ))
    algo.addTask(new Task('Task2', 'Task2Description', [
        (values) => {
            algo.display(values.labels)
            algo.display("Task2Part1");
            return { task2: 'task2Part1' }
        },
        (values) => {
            return { task2: 'task2Part2' }
        }

    ]))
}