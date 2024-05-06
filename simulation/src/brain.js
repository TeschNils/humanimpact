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
                this.connections.push(new Connection(this.nodes[i], this.nodes[j], Math.random()));
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

    feedForward(input1, input2) {
        // Normalize inputs to the range [0, 1]
        let normalizedInput1 = input1;
        let normalizedInput2 = input2;

        // Set input values
        this.genome.setInputValues([normalizedInput1, normalizedInput2]);

        // Perform feedforward pass
        this.genome.feedForward();

        // Get output values
        let outputValues = this.genome.getOutputValues();

        return outputValues[0]; // Assuming outputSize is 1
    }
}

// Example usage:
let network = new NEATNetwork(2, 1); // Input size: 2, Output size: 1
let input1 = 0.5;
let input2 = 0.7;

let output = network.feedForward(input1, input2);
console.log("Output:", output);
