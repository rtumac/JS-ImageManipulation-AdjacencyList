'use strict';

/**
 * File:     adjacency-list.js
 * Author:   Remus Tumac
 * Date:     12-04-2017
 * Purpose:  Provides a basic implmentation of an adjacency list and the ability
 *           to perform a topological sort on such data structure.
 */


 /**
  * Represents a node inside the adjacency list
  */
class Node {
    constructor(value, index) {
        this.value = value;
        this.visited = false;
        this.index = index;
    }
}

/**
 * Adjacency list implemented with the help of a list of lists
 */
class AdjacencyList {
    constructor() {
        this.list = [];
    }

    /**
     * Creates a new row in the adjacency list
     * @param item the value stored in the node that is being inserted
     */
    pushRow(item) {
        let index = this.list.length;
        this.list.push([new Node(item, index)]);
    }

    /**
     * Pushes a new pair of nodes inside the adjacency list
     * @param key the parent node
     * @param value the child node
     */
    push(key, value) {
        let size = this.list.length;
        let nodeLocation = -1;
        let rowPosition = -1;

        //search if key or value have been previously inserted
        for(let i = 0; i < size; i++) {
            if(this.list[i][0]['value'] === value) 
                nodeLocation = i;

            if(this.list[i][0]['value'] === key) 
                rowPosition = i;
        } 
        
        if(nodeLocation == -1) {
            this.pushRow(value);
            nodeLocation = this.list.length - 1;
        }

        if(rowPosition == -1) {
            this.pushRow(key);
            rowPosition = this.list.length - 1;            
        }

        //insert the new node
        this.list[rowPosition].push(this.list[nodeLocation][0]);
    }

    /**
     * Performs a topologic sort on the adjacency list
     * @param stack stores all nodes that had all its neighbours visited
     */
    topologicalSort(stack) {
        let size = this.list.length;
    
        for(let i = 0; i < size; i++) {
            if (this.list[i][0]['visited'] == false)
                this.topologicalSortHelper(stack, i);
        }
    }
    
    /**
     * Recursive Helper method for topologicalSort()
     * It recursively visits all the nodes that can be visited given the
     * position of a starting node 
     * @param stack stores all nodes that had all its neighbours visited
     * @param currentNode the current node
     */
    topologicalSortHelper(stack, currentNode) {
        this.list[currentNode][0]['visited'] = true;
        
        let rowSize = this.list[currentNode].length;
        for(let i = 1; i < rowSize; i++) {
            if(this.list[currentNode][i]['visited'] == false) {
                this.topologicalSortHelper(stack, 
                    this.list[currentNode][i]['index']);
            }
        }
    
        stack.push(this.list[currentNode][0]['value']);
    }
}


module.exports = AdjacencyList;