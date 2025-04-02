import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './MatrixTrace.css';

export default function MatrixTrace() {
  const [size, setSize] = useState(2);
  const [matrix, setMatrix] = useState(createEmptyMatrix(2));
  const [trace, setTrace] = useState(null);
  const [error, setError] = useState('');
  const [calculationSteps, setCalculationSteps] = useState([]);

  // Format numbers to 4 decimal places without trailing zeros
  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    const formatted = num.toFixed(4);
    return formatted.replace(/\.?0+$/, '');
  };

  function createEmptyMatrix(size) {
    return Array(size).fill().map(() => Array(size).fill(''));
  }

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setMatrix(createEmptyMatrix(newSize));
    resetResults();
  };

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
    resetResults();
  };

  const resetResults = () => {
    setTrace(null);
    setError('');
    setCalculationSteps([]);
  };

  const calculateTrace = () => {
    // Convert to numbers and validate
    const numMatrix = matrix.map(row => 
      row.map(val => val === '' ? NaN : parseFloat(val))
    );

    if (numMatrix.some(row => row.some(isNaN))) {
      setError('Please fill all cells with numbers');
      return;
    }

    // Initialize steps
    const steps = [];
    steps.push({
      title: 'Input Matrix',
      content: <BlockMath math={matrixToLatex(numMatrix)} />
    });

    // Calculate trace and build steps
    let traceValue = 0;
    let elements = [];
    
    for (let i = 0; i < size; i++) {
      traceValue += numMatrix[i][i];
      elements.push(`a_{${i+1}${i+1}}`);
      
      steps.push({
        title: `Element ${i+1}`,
        content: (
          <div className="text-center">
            <BlockMath math={`a_{${i+1}${i+1}} = ${formatNumber(numMatrix[i][i])}`} />
          </div>
        )
      });
    }

    // Add final summation step
    steps.push({
      title: 'Trace Calculation',
      content: (
        <div className="text-center">
          <BlockMath math={`\\text{tr}(A) = ${elements.join(' + ')} = ${formatNumber(traceValue)}`} />
        </div>
      )
    });

    setTrace(traceValue);
    setCalculationSteps(steps);
  };

  function matrixToLatex(matrix) {
    const rows = matrix.map(row => 
      row.map(val => {
        if (typeof val !== 'number') return val;
        return formatNumber(val);
      }).join(' & ')
    ).join(' \\\\ ');
    return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-grow p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-math-pi mb-4 text-center">
          Matrix Trace Calculator
        </h1>

        <div className="mb-6 flex flex-wrap justify-center items-center gap-4">
          <label className="text-gray-700 font-medium">
            Matrix Size:
          </label>
          <select 
            value={size}
            onChange={handleSizeChange}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n}×{n}</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
            Input Matrix ({size}×{size})
          </h2>
          <div className="matrix-grid-container">
            <div>
              {matrix.map((row, i) => (
                <div key={`row-${i}`} className="matrix-row">
                  {row.map((val, j) => (
                    <div key={`cell-${i}-${j}`} className="relative">
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                        className={`matrix-cell ${i === j ? 'bg-blue-50' : ''}`}
                        step="any"
                      />
                      {i === j && (
                        <div className="absolute -top-2 -right-2 text-xs bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center">
                          <InlineMath math={`a_{${i+1}${j+1}}`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={calculateTrace}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={matrix.flat().some(cell => cell === '')}
          >
            Calculate Trace
          </button>
          <button
            onClick={resetResults}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {trace !== null && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                Calculation Steps
              </h3>
              <div className="space-y-4">
                {calculationSteps.map((step, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                    <div className="text-center font-medium text-math-blue mb-1">
                      {step.title}
                    </div>
                    <div className="flex justify-center">
                      {step.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Link 
          to="/matrix" 
          className="flex justify-center mt-6 text-math-blue hover:underline font-medium text-sm"
        >
          ← Back to Matrix Calculators
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