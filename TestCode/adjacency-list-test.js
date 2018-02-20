/**
 * File:     adjacency-list-test.js
 * Author:   Remus Tumac
 * Date:     12-04-2017
 * Purpose:  Provides an example on how to use the functionalty offered by the 
 *           AdjacencyList class
 */


const AdjacencyList = require('../adjacency-list.js');

/**
 * Prints the results of a topological sort 
 * @param list a list containing the results of the sort
 */
function printResults(list) {
    let stackSize = list.length;
    for(let i = stackSize - 1; i > 0 ; i--) {
        process.stdout.write(list[i] + ' -> ');
    }
    console.log(list[0]);
}


console.log("***************************");
console.log("Tesing the first graph: ");
const adjacencyList = new AdjacencyList();
adjacencyList.push('A', 'B');
adjacencyList.push('A', 'D');
adjacencyList.push('B', 'E');
adjacencyList.push('C', 'A');
adjacencyList.push('C', 'D');
adjacencyList.push('D', 'B');
adjacencyList.push('D', 'E');

let stack = [];
adjacencyList.topologicalSort(stack);
printResults(stack);


console.log("***************************");
console.log("Tesing the second graph: ");
const adjacencyList2 = new AdjacencyList();
adjacencyList2.push('A', 'B');
adjacencyList2.push('B', 'D');
adjacencyList2.push('C', 'B');
adjacencyList2.push('C', 'G');
adjacencyList2.push('D', 'G');
adjacencyList2.push('E', 'D');
adjacencyList2.push('E', 'F');
adjacencyList2.push('E', 'I');
adjacencyList2.push('G', 'I');
adjacencyList2.push('H', 'F');
adjacencyList2.push('I', 'H');

stack = [];
adjacencyList2.topologicalSort(stack);
printResults(stack);