import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './Bisection.css';

// Alternative if MathQuill isn't working
const MathInput = ({ value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
    placeholder="x^2 - 4"
  />
);

export default function BisectionMethod() {
  const [functionStr, setFunctionStr] = useState('x^2 - 4');
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);
  const [tolerance, setTolerance] = useState(0.001);
  const [maxIterations, setMaxIterations] = useState(20);
  const [decimalPlaces, setDecimalPlaces] = useState(5);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculateBisection = () => {
    try {
      if (a >= b) throw new Error('b must be greater than a');
      if (tolerance <= 0) throw new Error('Tolerance must be positive');

      const steps = [];
      let currentA = a;
      let currentB = b;
      let iteration = 0;
      let hasRoot = false;
      let fA = evaluateFunction(currentA);
      let fB = evaluateFunction(currentB);
      
      if (fA * fB >= 0) {
        throw new Error('Function must have opposite signs at endpoints (f(a)*f(b) < 0)');
      }

      while (iteration < maxIterations) {
        const currentC = (currentA + currentB) / 2;
        const fC = evaluateFunction(currentC);
        const currentError = Math.abs(currentB - currentA) / 2;
        const fAfC = fA * fC;

        steps.push({
          iteration,
          a: currentA,
          b: currentB,
          c: currentC,
          fA,
          fB,
          fC,
          fAfC,
          error: currentError
        });

        if (Math.abs(fC) < tolerance || currentError < tolerance) {
          hasRoot = true;
          break;
        }

        iteration++;
        if (fC * fA < 0) {
          currentB = currentC;
          fB = fC;
        } else {
          currentA = currentC;
          fA = fC;
        }
      }

      setResults({
        root: hasRoot ? (currentA + currentB) / 2 : null,
        steps,
        iterations: iteration,
        finalError: hasRoot ? Math.abs(currentB - currentA) / 2 : null,
        finalFC: hasRoot ? evaluateFunction((currentA + currentB) / 2) : null
      });
      setError('');
    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  };

  const evaluateFunction = (x) => {
    try {
      const expr = functionStr
        .replace(/\^/g, '**')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      // Handle cubic, quadratic, etc.
      const processedExpr = expr
        .replace(/([a-zA-Z0-9]+)\*\*([a-zA-Z0-9]+)/g, 'Math.pow($1,$2)')
        .replace(/x/g, x);

      // eslint-disable-next-line no-new-func
      return new Function(`return ${processedExpr}`)();
    } catch (err) {
      throw new Error('Invalid function expression');
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    const factor = Math.pow(10, decimalPlaces);
    const rounded = Math.round(num * factor) / factor;
    return rounded.toString().replace(/\.?0+$/, '');
  };

  const resetCalculator = () => {
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      <main className="flex-grow p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-math-pi mb-4 text-center">
          Bisection Method Calculator
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Function Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Function f(x):
              </label>
              <MathInput value={functionStr} onChange={setFunctionStr} />
              <div className="text-base text-gray-700">
                Preview: <InlineMath math={functionStr || '\\ '} />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Supported functions: x^n, sqrt(), sin(), cos(), tan(), log(), ln(), exp(), pi, e
              </div>
            </div>

            {/* Interval Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  a (initial):
                </label>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  b (initial):
                </label>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* Tolerance and Max Iterations */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tolerance (ε):
              </label>
              <input
                type="number"
                value={tolerance}
                step="0.0001"
                min="0.0001"
                onChange={(e) => setTolerance(parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Iterations:
              </label>
              <input
                type="number"
                value={maxIterations}
                min="1"
                max="100"
                onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Decimal Places */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Decimal Places:
              </label>
              <input
                type="number"
                value={decimalPlaces}
                min="1"
                max="15"
                onChange={(e) => setDecimalPlaces(parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <button
              onClick={calculateBisection}
              className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Calculate Root
            </button>
            <button
              onClick={resetCalculator}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-math-blue mb-4">
                Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">
                    Approximate root: <InlineMath math={`x \\approx ${formatNumber(results.root)}`} />
                  </p>
                  <p className="text-gray-700">
                    Iterations: {results.iterations}
                  </p>
                  <p className="text-gray-700">
                    Final error: <InlineMath math={`\\leq ${formatNumber(results.finalError)}`} />
                  </p>
                </div>
                <div>
                  <BlockMath math={`f(${formatNumber(results.root)}) = ${formatNumber(results.finalFC)}`} />
                  <p className="text-gray-700 mt-2">
                    <InlineMath math={`|f(c)| = ${formatNumber(Math.abs(results.finalFC))} < \\epsilon`} />
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
              <h2 className="text-xl font-semibold text-math-blue mb-4">
                Iteration Table
              </h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Iteration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">a</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">b</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">c = (a+b)/2</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">f(a)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">f(c)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">f(a)*f(c)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.steps.map((step, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{step.iteration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.a)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.b)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.c)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.fA)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.fC)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.fAfC)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.error)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Link 
          to="/numerical" 
          className="flex justify-center mt-6 text-math-blue hover:underline font-medium text-sm"
        >
          ← Back to Numerical Calculators
        </Link>
      </main>

      <div className="hidden md:block w-[160px] shrink-0 sticky top-4 h-[600px]">
        <AdBanner 
          location="right" 
          dimensions="160x600"
          className="h-full"
        />
      </div>
    </div>
  );
}