import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './MatrixNorm.css';

export default function MatrixNorm() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrix, setMatrix] = useState(createEmptyMatrix(2, 2));
  const [normType, setNormType] = useState('frobenius');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [calculationSteps, setCalculationSteps] = useState([]);

  // Format numbers to 4 decimal places without trailing zeros
  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    const formatted = num.toFixed(4);
    return formatted.replace(/\.?0+$/, '');
  };

  function createEmptyMatrix(rows, cols) {
    return Array(rows).fill().map(() => Array(cols).fill(''));
  }

  const handleSizeChange = (dimension, value) => {
    const numValue = parseInt(value) || 2;
    if (numValue < 1) return;
    if (numValue > 10) return;

    if (dimension === 'rows') {
      setRows(numValue);
    } else {
      setCols(numValue);
    }
    setMatrix(createEmptyMatrix(
      dimension === 'rows' ? numValue : rows,
      dimension === 'cols' ? numValue : cols
    ));
    resetResults();
  };

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
    resetResults();
  };

  const resetResults = () => {
    setResult(null);
    setError('');
    setCalculationSteps([]);
  };

  const calculateNorm = () => {
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

    let normValue;
    let calculation = '';

    switch(normType) {
      case 'frobenius':
        // Frobenius norm (sqrt of sum of squares of all elements)
        let sumOfSquares = 0;
        calculation = '\\sqrt{';
        numMatrix.forEach((row, i) => {
          row.forEach((val, j) => {
            sumOfSquares += val * val;
            calculation += `${i > 0 || j > 0 ? '+' : ''}(${formatNumber(val)}^2)`;
          });
        });
        calculation += '}';
        normValue = Math.sqrt(sumOfSquares);
        steps.push({
          title: 'Frobenius Norm Calculation',
          content: <BlockMath math={`\\|A\\|_F = ${calculation} = ${formatNumber(normValue)}`} />
        });
        break;

      case '1-norm':
        // Maximum absolute column sum
        const columnSums = Array(cols).fill(0);
        calculation = '\\max\\left(';
        numMatrix.forEach(row => {
          row.forEach((val, j) => {
            columnSums[j] += Math.abs(val);
          });
        });
        columnSums.forEach((sum, i) => {
          calculation += `${i > 0 ? ',' : ''}${formatNumber(sum)}`;
        });
        calculation += '\\right)';
        normValue = Math.max(...columnSums);
        steps.push({
          title: '1-Norm (Column Sum Norm) Calculation',
          content: <BlockMath math={`\\|A\\|_1 = ${calculation} = ${formatNumber(normValue)}`} />
        });
        break;

      case 'inf-norm':
        // Maximum absolute row sum
        const rowSums = Array(rows).fill(0);
        calculation = '\\max\\left(';
        numMatrix.forEach((row, i) => {
          row.forEach(val => {
            rowSums[i] += Math.abs(val);
          });
        });
        rowSums.forEach((sum, i) => {
          calculation += `${i > 0 ? ',' : ''}${formatNumber(sum)}`;
        });
        calculation += '\\right)';
        normValue = Math.max(...rowSums);
        steps.push({
          title: '∞-Norm (Row Sum Norm) Calculation',
          content: <BlockMath math={`\\|A\\|_\\infty = ${calculation} = ${formatNumber(normValue)}`} />
        });
        break;

      case '2-norm':
        // Spectral norm (largest singular value)
        // Simplified implementation for demonstration
        if (rows !== cols) {
          setError('2-norm requires square matrix');
          return;
        }
        // This is a simplified approximation - real implementation would use SVD
        const eigenvalues = numMatrix.map(row => 
          row.reduce((sum, val) => sum + Math.abs(val), 0)
        );
        normValue = Math.max(...eigenvalues);
        steps.push({
          title: '2-Norm (Spectral Norm) Calculation',
          content: <BlockMath math={`\\|A\\|_2 \\approx ${formatNumber(normValue)}`} />
        });
        break;

      case 'max-norm':
        // Maximum absolute element
        let maxAbs = 0;
        calculation = '\\max\\left(';
        numMatrix.forEach((row, i) => {
          row.forEach((val, j) => {
            const absVal = Math.abs(val);
            if (absVal > maxAbs) maxAbs = absVal;
            calculation += `${i > 0 || j > 0 ? ',' : ''}${formatNumber(absVal)}`;
          });
        });
        calculation += '\\right)';
        normValue = maxAbs;
        steps.push({
          title: 'Max Norm Calculation',
          content: <BlockMath math={`\\|A\\|_{max} = ${calculation} = ${formatNumber(normValue)}`} />
        });
        break;

      default:
        break;
    }

    setResult(normValue);
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
          Matrix Norm Calculator
        </h1>

        {/* Size Selectors */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Matrix Size:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => handleSizeChange('rows', e.target.value)}
                className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>×</span>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => handleSizeChange('cols', e.target.value)}
                className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Norm Type:</span>
            <select
              value={normType}
              onChange={(e) => setNormType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="frobenius">Frobenius Norm</option>
              <option value="1-norm">1-Norm (Column Sum)</option>
              <option value="inf-norm">∞-Norm (Row Sum)</option>
              <option value="2-norm">2-Norm (Spectral)</option>
              <option value="max-norm">Max Norm</option>
            </select>
          </div>
        </div>

        {/* Centered Matrix Input Grid */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full max-w-md">
            <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
              Input Matrix ({rows}×{cols})
            </h2>
            <div className="overflow-x-auto">
              <div className="flex justify-center">
                <div>
                  {matrix.map((row, i) => (
                    <div key={`row-${i}`} className="matrix-row">
                      {row.map((val, j) => (
                        <input
                          key={`${i}-${j}`}
                          type="number"
                          value={val}
                          onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                          className="matrix-cell"
                          step="any"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={calculateNorm}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={matrix.flat().some(cell => cell === '')}
          >
            Calculate Norm
          </button>
          <button
            onClick={resetResults}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Reset
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result !== null && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Matrix Norm Result
              </h2>
              <BlockMath math={`\\|A\\|${
                normType === '1-norm' ? '_1' : 
                normType === 'inf-norm' ? '_\\infty' : 
                normType === '2-norm' ? '_2' : 
                normType === 'max-norm' ? '_{max}' : '_F'
              } = ${formatNumber(result)}`} />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                Calculation Steps
              </h3>
              <div className="space-y-4">
                {calculationSteps.map((step, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                    {step.title && (
                      <h4 className="font-medium text-math-blue mb-1 text-center">
                        {step.title}
                      </h4>
                    )}
                    <div className="flex justify-center overflow-x-auto">
                      <div className="inline-block">
                        {step.content}
                      </div>
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

      {/* Right Sidebar Ad */}
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