class Node {
    constructor(id) {
        this.id = id;
        this.inputSum = 0;
        this.outputValue = 0;
        this.connections = [];
    }
}

class Connection {
    constructor(from, to, weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
        this.enabled = true;
    }
}

class Genome {
    constructor(inputSize, outputSize) {
        this.inputSize = inputSize;
        this.outputSize = outputSize;
        this.nodes = [];
        this.connections = [];
        this.nextNodeId = 0;

        // Create input nodes
        for (let i = 0; i < inputSize; i++) {
            this.nodes.push(new Node(this.nextNodeId++));
        }

        // Create output nodes
        for (let i = 0; i < outputSize; i++) {
            this.nodes.push(new Node(this.nextNodeId++));
        }

        // Create connections between input and output nodes
        for (let i = 0; i < inputSize; i++) {
            for (let j = inputSize; j < inputSize + outputSize; j++) {
                this.connections.push(new Connection(this.nodes[i], this.nodes[j], random(-2, 2)));
            }
        }
    }

    setInputValues(inputValues) {
        if (inputValues.length !== this.inputSize) {
            throw new Error("Input size mismatch");
        }

        for (let i = 0; i < this.inputSize; i++) {
            this.nodes[i].outputValue = inputValues[i];
        }
    }

    feedForward() {
        for (let node of this.nodes) {
            node.inputSum = 0;
        }

        for (let connection of this.connections) {
            if (connection.enabled) {
                connection.to.inputSum += connection.from.outputValue * connection.weight;
            }
        }

        for (let node of this.nodes) {
            if (node.id >= this.inputSize) {
                node.outputValue = sigmoid(node.inputSum);
            }
        }
    }

    getOutputValues() {
        let outputValues = [];
        for (let i = this.inputSize; i < this.inputSize + this.outputSize; i++) {
            outputValues.push(this.nodes[i].outputValue);
        }
        return outputValues;
    }
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

class NEATNetwork {
    constructor(inputSize, outputSize) {
        this.inputSize = inputSize;
        this.outputSize = outputSize;
        this.genome = new Genome(inputSize, outputSize);
    }

    feedForward(inputValues) {
        this.genome.setInputValues(inputValues);
        this.genome.feedForward();
        let outputValues = this.genome.getOutputValues();

        return outputValues;
    }

    crossoverAndMutate(parent1, parent2, mutationChance, mutationFactor) {
        // Assume parent1 and parent2 are instances of NEATNetwork
        const inputSize = parent1.inputSize;
        const outputSize = parent1.outputSize;

        // Create a new genome for the child network
        let childGenome = new Genome(inputSize, outputSize);

        // Dictionary to store nodes by id
        let nodeDict = {};
        parent1.genome.nodes.forEach(node => nodeDict[node.id] = new Node(node.id));
        parent2.genome.nodes.forEach(node => nodeDict[node.id] = new Node(node.id));

        // Combine connections
        let allConnections = {};

        // Add connections from both parents, avoiding duplicates
        parent1.genome.connections.forEach(connection => {
            let key = `${connection.from.id}-${connection.to.id}`;
            allConnections[key] = connection;
        });

        parent2.genome.connections.forEach(connection => {
            let key = `${connection.from.id}-${connection.to.id}`;
            if (!allConnections[key]) {
                allConnections[key] = connection;
            }
        });

        // Add connections to child genome, perform crossover
        for (let key in allConnections) {
            let parentConnection1 = parent1.genome.connections.find(conn => `${conn.from.id}-${conn.to.id}` === key);
            let parentConnection2 = parent2.genome.connections.find(conn => `${conn.from.id}-${conn.to.id}` === key);

            let chosenConnection;
            if (parentConnection1 && parentConnection2) {
                // Both parents have the connection, randomly choose one
                chosenConnection = Math.random() < 0.5 ? parentConnection1 : parentConnection2;
            } else {
                // Only one parent has the connection, choose that one
                chosenConnection = parentConnection1 || parentConnection2;
            }

            let newConnection = new Connection(nodeDict[chosenConnection.from.id], nodeDict[chosenConnection.to.id], chosenConnection.weight);
            newConnection.enabled = chosenConnection.enabled;

            // Mutate the connection weight with a small probability
            if (random() < mutationChance) {
                newConnection.weight += random(-1, 1) * mutationFactor;
            }

            childGenome.connections.push(newConnection);
        }

        // Add nodes to child genome
        for (let nodeId in nodeDict) {
            childGenome.nodes.push(nodeDict[nodeId]);
        }

        // Mutate nodes (add new connections or nodes)
        if (random() < 0.05) {
            // Add a new connection with a small probability
            let fromNode = childGenome.nodes[Math.floor(Math.random() * childGenome.nodes.length)];
            let toNode = childGenome.nodes[Math.floor(Math.random() * childGenome.nodes.length)];
            if (fromNode.id !== toNode.id) {
                let newConnection = new Connection(fromNode, toNode, random(-2, 2));
                childGenome.connections.push(newConnection);
            }
        }

        if (random() < 0.03) {
            // Add a new node with a small probability
            let existingConnection = childGenome.connections[Math.floor(Math.random() * childGenome.connections.length)];
            let newNode = new Node(childGenome.nextNodeId++);
            let newConnection1 = new Connection(existingConnection.from, newNode, 1.0);
            let newConnection2 = new Connection(newNode, existingConnection.to, existingConnection.weight);
            childGenome.nodes.push(newNode);
            childGenome.connections.push(newConnection1);
            childGenome.connections.push(newConnection2);
            existingConnection.enabled = false;
        }

        this.genome = childGenome;
    }
}

// Example usage:
let network = new NEATNetwork(2, 1); // Input size: 2, Output size: 1
let output = network.feedForward([0.5, 0.7]);
console.log("Output:", output);
