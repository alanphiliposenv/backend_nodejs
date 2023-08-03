interface CalculatorInterface {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
    multiply(a: number, b: number): number;
    divide(a: number, b: number): number;
}

class Calculator implements CalculatorInterface {
    add(a: number, b: number): number {
        return a+b;
    }
    subtract(a: number, b: number): number {
        return a-b;
    }
    multiply(a: number, b: number): number {
        return a*b;
    }
    divide(a: number, b: number): number {
        return a/b;
    }
}

const calc = new Calculator();
console.log(calc.add(3, 4));
console.log(calc.subtract(3, 4));
console.log(calc.multiply(3, 4));
console.log(calc.divide(3, 4));
