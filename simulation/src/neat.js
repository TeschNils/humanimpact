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

        for (let i = 0; i < inputSize; i++) {
            this.nodes.push(new Node(this.nextNodeId++));
        }

        for (let i = 0; i < outputSize; i++) {
            this.nodes.push(new Node(this.nextNodeId++));
        }

        // Connections between input and output nodes
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

        this.mutationChance = 0.075;
        this.mutationFactor = 0.075;
    }

    feedForward(inputValues) {
        this.genome.setInputValues(inputValues);
        this.genome.feedForward();
        let outputValues = this.genome.getOutputValues();

        return outputValues;
    }

    crossover(parent1, parent2, fittestParent) {
        const inputSize = parent1.inputSize;
        const outputSize = parent1.outputSize;

        this.genome = new Genome(inputSize, outputSize);

        let nodeDict = {};
        parent1.genome.nodes.forEach(node => nodeDict[node.id] = new Node(node.id));
        parent2.genome.nodes.forEach(node => nodeDict[node.id] = new Node(node.id));

        let allConnections = {};

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

        for (let key in allConnections) {
            let parentConnection1 = parent1.genome.connections.find(conn => `${conn.from.id}-${conn.to.id}` === key);
            let parentConnection2 = parent2.genome.connections.find(conn => `${conn.from.id}-${conn.to.id}` === key);

            let chosenConnection;
            if (parentConnection1 && parentConnection2) {
                if (random(0, 1) < 0.9) {
                    chosenConnection = fittestParent === 1 ? parentConnection1 : parentConnection2;
                } else {
                    chosenConnection = fittestParent === 1 ? parentConnection2 : parentConnection1;
                }
            } else {
                chosenConnection = parentConnection1 || parentConnection2;
            }

            let newConnection = new Connection(nodeDict[chosenConnection.from.id], nodeDict[chosenConnection.to.id], chosenConnection.weight);
            newConnection.enabled = chosenConnection.enabled;

            this.genome.connections.push(newConnection);
        }

        for (let nodeId in nodeDict) {
            this.genome.nodes.push(nodeDict[nodeId]);
        }
    }

    mutate() {
        for (let connection of this.genome.connections) {
            if (random() < this.mutationChance) {
                connection.weight += random(-1, 1) * this.mutationFactor;
            }
        }

        if (random() < this.mutationChance) {
            let fromNode = this.genome.nodes[Math.floor(random() * this.genome.nodes.length)];
            let toNode = this.genome.nodes[Math.floor(random() * this.genome.nodes.length)];
            if (fromNode.id !== toNode.id) {
                let newConnection = new Connection(fromNode, toNode, random(-2, 2));
                this.genome.connections.push(newConnection);
            }
        }

        if (random() < this.mutationChance) {
            let existingConnection = this.genome.connections[Math.floor(random() * this.genome.connections.length)];
            let newNode = new Node(this.genome.nextNodeId++);
            let newConnection1 = new Connection(existingConnection.from, newNode, 1.0);
            let newConnection2 = new Connection(newNode, existingConnection.to, existingConnection.weight);
            this.genome.nodes.push(newNode);
            this.genome.connections.push(newConnection1);
            this.genome.connections.push(newConnection2);
            existingConnection.enabled = false;
        }
    }

    crossoverAndMutate(parent1, parent2, fittestParent) {
        this.crossover(parent1, parent2, fittestParent);
        this.mutate();
    }
}

// Example usage:
// let network = new NEATNetwork(2, 1); // Input size: 2, Output size: 1
// let output = network.feedForward([0.5, 0.7]);
// console.log("Output:", output);
