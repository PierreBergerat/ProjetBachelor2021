// Exemple d'utilisation du framework
let algo = new Algorithm({
    name: 'Decision Tree',
    tableContainer: 'container',
    explanationContainer: 'explications'
});
const artintRun = () => {
    algo.addTask(new Task('Calculer l\'entropie de la colonne d\'observation',
        'On va utiliser la formule vue en cours pour calculer l\'entropie',
        [
            (values) => {
                algo.display("Tout d'abord je vais observer les différents labels possibles dans la colonne d\'observation");
                return {
                    labels:
                        Array.from(new Set(algo.table.filterData((e, x, y) => { return x == algo.table.cols - 1 && y != 0 }).map(x => { return x.value })))
                };
            },
            (values) => {
                let str = ""
                for (let i = 0; i < values.labels.length; i++) {
                    if (i != 0 && i == values.labels.length - 1) {
                        str += " et "
                    }
                    str += values.labels[i]
                    if (i != 0 && i != values.labels.length - 1) {
                        str += ", "
                    }
                }
                algo.table.selectWhere(algo.table.filterData((e, x, y) => { return x == algo.table.cols - 1 && y != 0 }))
                algo.display(`il existe ${values.labels.length} valeurs pour la dernière colonne, ` + str);
                return values;
            },
            (values) => {
                algo.display('Ensuite je vais compter le nombre de chacunes de ces valeurs, en commençant par ' + values.labels[0])
                algo.table.selectWhere(algo.table.filterData((e, x, y) => { return e == values.labels[0] && x == algo.table.cols - 1 && y != 0 }))
                return {
                    nbLabels: {
                        [values.labels[0]]:
                            algo.table.filterData((e, x, y) => { return e == values.labels[0] && x == algo.table.cols - 1 && y != 0 }).length
                    }
                };
            },
            (values) => {
                algo.table.selectWhere(algo.table.filterData((e, x, y) => { return e != values.labels[0] && x == algo.table.cols - 1 && y != 0 }), 'red', false)
                algo.display('Il y en a ' + values.nbLabels[values.labels[0]] + '. Je vais maintenant calculer l\'entropie de ' + algo.table.data[0][algo.table.cols - 1] + ' par rapport aux nombres de cas totaux, qui sont au nombre de ' + (algo.table.rows - 1))
                return {
                    entropy: {
                        [algo.table.data[0][algo.table.cols - 1]]:
                            Utils.calculateEntropy(values.nbLabels[values.labels[0]], algo.table.rows - 1)
                    }
                }
            },
            (values) => {
                algo.display(`J\'obtiens ` + Utils.entropyFormula(values.nbLabels[values.labels[0]], algo.table.rows - 1))
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
            algo.display(values);
            algo.display("test2")
            return { task2: 'task2Part2' }
        }
    ]))
    algo.addTask(new Task('Task3', 'Task3Description', [
        (values) => {
            algo.display('coucou')
            return values
        }
    ]))
    algo.next()
}