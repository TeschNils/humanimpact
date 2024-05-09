class Brain {
    constructor() {
        this.inputSize = 3;
        this.hiddenSize = 3;
        this.outputSize = 1;

        this.weightMatrix1 = this.initializeMatrix(this.hiddenSize, this.inputSize);
        this.weightMatrix2 = this.initializeMatrix(this.outputSize, this.hiddenSize);

        this.mutationChance = 0.1;
        this.mutationFactor = 0.1;
    }

    inheritBrain(parentBrain) {
        this.weightMatrix1 = parentBrain.weightMatrix1;
        this.weightMatrix2 = parentBrain.weightMatrix2;

        this.weightMatrix1 = this.mutateWeightMatrix(this.weightMatrix1);
        this.weightMatrix2 = this.mutateWeightMatrix(this.weightMatrix2);
    }

    mutateWeightMatrix(weightMatrix) {
        for (let i=0; i<weightMatrix.length; i++) {
            for (let j=0; j<weightMatrix[0].length; j++) {
                if (random(0, 1) < this.mutationChance) {
                    let mutationValue = random(-this.mutationFactor, this.mutationFactor)
                    weightMatrix[i][j] = Math.max(-1, Math.min(weightMatrix[i][j] + mutationValue, 1.0));
                }
            }
        }
        return weightMatrix;
    }

    initializeMatrix(rows, cols) {
        let matrix = new Array(rows);
        for (let i = 0; i < rows; i++) {
            matrix[i] = new Array(cols);
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = this.randomFloat(-1, 1);
            }
        }
        return matrix;
    }

    sigmoid(x, length) {
        for (let i = 0; i < length; i++) {
            x[i] = 1.0 / (1.0 + Math.exp(-x[i]));
        }
        return x;
    }

    tanh(x, length) {
        for (let i = 0; i < length; i++) {
            x[i] = (Math.exp(x[i]) - Math.exp(-x[i])) / (Math.exp(x[i]) + Math.exp(-x[i]));
        }
        return x;
    }

    relu(x, length) {
        for (let i = 0; i < length; i++) {
            if (x[i] < 0.0) {
                x[i] = 0.0;
            } else {
                x[i] = x[i];
            }
        }
        return x;
    }

    dot(w, x, matRows, matCols) {
        let result = new Array(matRows).fill(0.0);

        for (let i = 0; i < matRows; i++) {
            for (let j = 0; j < matCols; j++) {
                result[i] += w[i][j] * x[j];
            }
        }

        return result;
    }

    forward(observation) {
        let input = observation;
        let hiddenLayer = this.relu(this.dot(this.weightMatrix1, input, this.hiddenSize, this.inputSize), this.hiddenSize);
        let output = this.sigmoid(this.dot(this.weightMatrix2, hiddenLayer, this.outputSize, this.hiddenSize), this.outputSize);

        // no hidden layer forward feed
        // let output = this.sigmoid(this.dot(this.weightMatrix1, input, this.outputSize, this.inputSize), this.outputSize);

        return output;
    }

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
}
