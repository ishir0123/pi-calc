import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './PseudoInverse.css';

export default function PseudoInverse() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(2);
  const [matrix, setMatrix] = useState(createEmptyMatrix(rows, cols));
  const [pseudoInverse, setPseudoInverse] = useState(null);
  const [error, setError] = useState('');
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [methodUsed, setMethodUsed] = useState('');

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
    if (numValue < 1 || numValue > 10) return;

    if (dimension === 'rows') {
      setRows(numValue);
      setMatrix(createEmptyMatrix(numValue, cols));
    } else {
      setCols(numValue);
      setMatrix(createEmptyMatrix(rows, numValue));
    }
    resetResults();
  };

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
    resetResults();
  };

  const resetResults = () => {
    setPseudoInverse(null);
    setError('');
    setCalculationSteps([]);
    setMethodUsed('');
  };

  const calculatePseudoInverse = () => {
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
      title: 'Original Matrix A',
      content: <BlockMath math={matrixToLatex(numMatrix)} />
    });

    // Check matrix shape and rank to determine method
    const isTall = rows > cols;
    const transpose = numMatrix[0].map((_, i) => numMatrix.map(row => row[i]));
    
    let result;
    try {
      if (isTall) {
        setMethodUsed('tall');
        // A⁺ = (AᵀA)⁻¹Aᵀ (for full column rank)
        steps.push({
          title: 'Matrix is tall (rows > columns), using formula:',
          content: <BlockMath math="A^+ = (A^T A)^{-1} A^T" />
        });

        // Compute AᵀA
        const ata = multiplyMatrices(transpose, numMatrix);
        steps.push({
          title: 'Step 1: Compute AᵀA',
          content: <BlockMath math={matrixToLatex(ata)} />
        });

        // Compute inverse of AᵀA
        const invAta = invertMatrix(ata);
        steps.push({
          title: 'Step 2: Compute (AᵀA)⁻¹',
          content: <BlockMath math={matrixToLatex(invAta)} />
        });

        // Compute Aᵀ
        steps.push({
          title: 'Step 3: Compute Aᵀ',
          content: <BlockMath math={matrixToLatex(transpose)} />
        });

        // Final multiplication
        result = multiplyMatrices(invAta, transpose);
      } else {
        setMethodUsed('wide');
        // A⁺ = Aᵀ(AAᵀ)⁻¹ (for full row rank)
        steps.push({
          title: 'Matrix is wide (columns > rows), using formula:',
          content: <BlockMath math="A^+ = A^T (A A^T)^{-1}" />
        });

        // Compute AAᵀ
        const aat = multiplyMatrices(numMatrix, transpose);
        steps.push({
          title: 'Step 1: Compute AAᵀ',
          content: <BlockMath math={matrixToLatex(aat)} />
        });

        // Compute inverse of AAᵀ
        const invAat = invertMatrix(aat);
        steps.push({
          title: 'Step 2: Compute (AAᵀ)⁻¹',
          content: <BlockMath math={matrixToLatex(invAat)} />
        });

        // Compute Aᵀ
        steps.push({
          title: 'Step 3: Compute Aᵀ',
          content: <BlockMath math={matrixToLatex(transpose)} />
        });

        // Final multiplication
        result = multiplyMatrices(transpose, invAat);
      }

      steps.push({
        title: `Final Pseudoinverse A⁺ (${cols}×${rows})`,
        content: <BlockMath math={matrixToLatex(result)} />
      });

      setPseudoInverse(result);
      setCalculationSteps(steps);
    } catch (e) {
      setError('Matrix is rank deficient - pseudoinverse cannot be computed');
    }
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

  // Helper function to multiply matrices
  function multiplyMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < a[0].length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  // Helper function to invert matrix (using Gaussian elimination)
  function invertMatrix(matrix) {
    const n = matrix.length;
    const identity = Array(n).fill().map((_, i) => 
      Array(n).fill().map((_, j) => i === j ? 1 : 0)
    );
    
    const augmented = matrix.map((row, i) => [...row, ...identity[i]]);
    
    for (let i = 0; i < n; i++) {
      // Find the row with maximum element in current column
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = j;
        }
      }
      
      // Swap rows
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      
      // Singular matrix check
      if (Math.abs(augmented[i][i]) < 1e-10) {
        throw new Error('Matrix is singular');
      }
      
      // Normalize the current row
      const pivot = augmented[i][i];
      for (let j = i; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }
      
      // Eliminate other rows
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          const factor = augmented[j][i];
          for (let k = i; k < 2 * n; k++) {
            augmented[j][k] -= factor * augmented[i][k];
          }
        }
      }
    }
    
    // Extract the inverse matrix
    return augmented.map(row => row.slice(n));
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-grow p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-math-pi mb-4 text-center">
          Matrix Pseudoinverse Calculator (Moore-Penrose)
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
        </div>

        {/* Centered Matrix Input Grid */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full max-w-md">
            <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
              Input Matrix ({rows}×{cols})
            </h2>
            <div className="overflow-x-auto">
              <div className="flex justify-center">
                <div className="inline-block">
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
            onClick={calculatePseudoInverse}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={matrix.flat().some(cell => cell === '')}
          >
            Calculate Pseudoinverse (A⁺)
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

        {methodUsed && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
            <p className="text-blue-700 text-sm">
              Using {methodUsed === 'tall' ? (
                <InlineMath math="A^+ = (A^T A)^{-1} A^T" />
              ) : (
                <InlineMath math="A^+ = A^T (A A^T)^{-1}" />
              )} formula
            </p>
          </div>
        )}

        {pseudoInverse && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Pseudoinverse Matrix (A⁺) ({cols}×{rows})
              </h2>
              <div className="overflow-x-auto">
                <div className="inline-block">
                  <BlockMath math={matrixToLatex(pseudoInverse)} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                Calculation Steps
              </h3>
              <div className="space-y-4">
                {calculationSteps.map((step, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                    <h4 className="font-medium text-math-blue mb-1 text-center">
                      {step.title}
                    </h4>
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