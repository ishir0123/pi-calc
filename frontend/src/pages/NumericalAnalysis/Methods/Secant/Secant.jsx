import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './Secant.css';

export default function SecantMethod() {
  const [functionStr, setFunctionStr] = useState('x^2 - 4');
  const [x0, setX0] = useState(1);
  const [x1, setX1] = useState(3);
  const [tolerance, setTolerance] = useState(0.001);
  const [maxIterations, setMaxIterations] = useState(20);
  const [decimalPlaces, setDecimalPlaces] = useState(5);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculateRoot = () => {
    try {
      if (tolerance <= 0) throw new Error('Tolerance must be positive');
      if (x0 === x1) throw new Error('Initial guesses must be different');

      const steps = [];
      let currentX0 = x0;
      let currentX1 = x1;
      let iteration = 0;
      let hasRoot = false;

      while (iteration < maxIterations) {
        const fx0 = evaluateFunction(currentX0);
        const fx1 = evaluateFunction(currentX1);

        if (Math.abs(fx1 - fx0) < 1e-10) {
          throw new Error('Denominator too small - method cannot continue');
        }

        const nextX = currentX1 - fx1 * (currentX1 - currentX0) / (fx1 - fx0);
        const currentError = Math.abs(nextX - currentX1);

        steps.push({
          iteration,
          x0: currentX0,
          x1: currentX1,
          fx0,
          fx1,
          nextX,
          error: currentError
        });

        if (Math.abs(fx1) < tolerance || currentError < tolerance) {
          hasRoot = true;
          break;
        }

        currentX0 = currentX1;
        currentX1 = nextX;
        iteration++;
      }

      setResults({
        root: hasRoot ? currentX1 : null,
        steps,
        iterations: iteration,
        finalError: hasRoot ? Math.abs(evaluateFunction(currentX1)) : null
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
        .replace(/\s+/g, '')
        .replace(/\^/g, '**')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(');
      
      // eslint-disable-next-line no-new-func
      return new Function('x', `return ${expr}`)(x);
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
          Secant Method Calculator
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Function Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Function f(x):
              </label>
              <input
                type="text"
                value={functionStr}
                onChange={(e) => {
                  setFunctionStr(e.target.value);
                  setResults(null);
                  setError('');
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="x^2 - 4"
              />
              <div className="text-lg text-gray-700">
                Preview: <InlineMath math={functionStr || '\\ '} />
              </div>
            </div>

            {/* Initial Guesses */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  x₀ (first guess):
                </label>
                <input
                  type="number"
                  value={x0}
                  onChange={(e) => setX0(parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  x₁ (second guess):
                </label>
                <input
                  type="number"
                  value={x1}
                  onChange={(e) => setX1(parseFloat(e.target.value))}
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
              onClick={calculateRoot}
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
                  <BlockMath math={`f(x) = ${functionStr}`} />
                  <BlockMath math={`f(${formatNumber(results.root)}) = ${formatNumber(evaluateFunction(results.root))}`} />
                  <p className="text-gray-700 mt-2">
                    <InlineMath math={`|f(x)| = ${formatNumber(Math.abs(evaluateFunction(results.root)))} < \\epsilon`} />
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
              <h2 className="text-xl font-semibold text-math-blue mb-4">
                Iteration Details
              </h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">n</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">xₙ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">xₙ₊₁</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">f(xₙ)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">f(xₙ₊₁)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <div className="katex-container">
                        <InlineMath math="x_{n+2} = x_{n+1} - \frac{f(x_{n+1})(x_{n+1}-x_n)}{f(x_{n+1})-f(x_n)}" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">error</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.steps.map((step, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{step.iteration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.x0)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.x1)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.fx0)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.fx1)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(step.nextX)}</td>
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