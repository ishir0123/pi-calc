import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './MatrixMultiplication.css';

export default function MatrixMultiplication() {
  // Matrix dimensions
  const [n, setN] = useState(2); // rows of A
  const [m, setM] = useState(2); // cols of A and rows of B
  const [o, setO] = useState(2); // cols of B
  
  // Matrices
  const [matrixA, setMatrixA] = useState(createEmptyMatrix(n, m));
  const [matrixB, setMatrixB] = useState(createEmptyMatrix(m, o));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [calculationSteps, setCalculationSteps] = useState([]);

  // Format numbers to 4 decimal places without trailing zeros
  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    const formatted = num.toFixed(4);
    return formatted.replace(/\.?0+$/, '');
  };

  // Recreate matrices when dimensions change
  useEffect(() => {
    setMatrixA(createEmptyMatrix(n, m));
    setMatrixB(createEmptyMatrix(m, o));
    resetResults();
  }, [n, m, o]);

  function createEmptyMatrix(rows, cols) {
    return Array(rows).fill().map(() => Array(cols).fill(''));
  }

  const handleMatrixChange = (matrix, setMatrix, row, col, value) => {
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

  const multiplyMatrices = () => {
    // Convert to numbers and validate
    const numMatrixA = matrixA.map(row => 
      row.map(val => val === '' ? NaN : parseFloat(val))
    );
    const numMatrixB = matrixB.map(row => 
      row.map(val => val === '' ? NaN : parseFloat(val))
    );

    if (numMatrixA.some(row => row.some(isNaN))) {
      setError('Please fill all cells in Matrix A with numbers');
      return;
    }

    if (numMatrixB.some(row => row.some(isNaN))) {
      setError('Please fill all cells in Matrix B with numbers');
      return;
    }

    // Initialize steps
    const steps = [];
    steps.push({
      title: 'Matrix A',
      content: <BlockMath math={matrixToLatex(numMatrixA)} />
    });
    steps.push({
      title: 'Matrix B',
      content: <BlockMath math={matrixToLatex(numMatrixB)} />
    });

    // Perform multiplication
    const productMatrix = Array(n).fill().map(() => Array(o).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < o; j++) {
        let sum = 0;
        let stepCalculation = '';
        
        for (let k = 0; k < m; k++) {
          const a = numMatrixA[i][k];
          const b = numMatrixB[k][j];
          sum += a * b;
          
          stepCalculation += `${k > 0 ? '+' : ''}(${formatNumber(a)} \\times ${formatNumber(b)})`;
          
          if (k === m - 1) {
            stepCalculation += `= ${formatNumber(sum)}`;
            steps.push({
              title: (
                <span>
                  Element <InlineMath math={`a_{${i+1}${j+1}}`} /> Calculation
                </span>
              ),
              content: <BlockMath math={`${stepCalculation}`} />
            });
          }
        }
        
        productMatrix[i][j] = sum;
      }
    }

    setResult(productMatrix);
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

  const handleDimensionChange = (dimension, value) => {
    const numValue = parseInt(value) || 2;
    if (numValue < 2) return;
    if (numValue > 10) return;

    switch(dimension) {
      case 'n':
        setN(numValue);
        break;
      case 'm':
        setM(numValue);
        setO(numValue); // Keep o in sync when m changes
        break;
      case 'o':
        setO(numValue);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex">
      <main className="flex-grow p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-math-pi mb-4 text-center">
          Matrix Multiplication Calculator
        </h1>

        {/* Dimension Selectors */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Matrix A:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="2"
                max="10"
                value={n}
                onChange={(e) => handleDimensionChange('n', e.target.value)}
                className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>×</span>
              <input
                type="number"
                min="2"
                max="10"
                value={m}
                onChange={(e) => handleDimensionChange('m', e.target.value)}
                className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Matrix B:</span>
            <div className="flex items-center gap-1">
              <span className="w-12 px-2 py-1 text-center">{m}</span>
              <span>×</span>
              <input
                type="number"
                min="2"
                max="10"
                value={o}
                onChange={(e) => handleDimensionChange('o', e.target.value)}
                className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
              />
            </div>
          </div>
        </div>

        {/* Centered Matrix Input Grids */}
        <div className="flex flex-col items-center gap-6 mb-6">
          {/* Matrix A */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full max-w-max">
            <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
              Matrix A ({n}×{m})
            </h2>
            <div className="flex justify-center">
              <div>
                {matrixA.map((row, i) => (
                  <div key={`rowA-${i}`} className="matrix-row">
                    {row.map((val, j) => (
                      <input
                        key={`A-${i}-${j}`}
                        type="number"
                        value={val}
                        onChange={(e) => handleMatrixChange(matrixA, setMatrixA, i, j, e.target.value)}
                        className="matrix-cell"
                        step="any"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Matrix B */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full max-w-max">
            <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
              Matrix B ({m}×{o})
            </h2>
            <div className="flex justify-center">
              <div>
                {matrixB.map((row, i) => (
                  <div key={`rowB-${i}`} className="matrix-row">
                    {row.map((val, j) => (
                      <input
                        key={`B-${i}-${j}`}
                        type="number"
                        value={val}
                        onChange={(e) => handleMatrixChange(matrixB, setMatrixB, i, j, e.target.value)}
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={multiplyMatrices}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={
              matrixA.flat().some(cell => cell === '') || 
              matrixB.flat().some(cell => cell === '')
            }
          >
            Calculate A × B
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

        {/* Results Display - No Scrollbars */}
        {result && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Product Matrix (A × B) ({n}×{o})
              </h2>
              <div className="flex justify-center">
                <BlockMath math={matrixToLatex(result)} />
              </div>
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