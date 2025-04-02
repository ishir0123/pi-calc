import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './MatrixTranspose.css';

export default function MatrixTranspose() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(3);
  const [matrix, setMatrix] = useState(createEmptyMatrix(rows, cols));
  const [transpose, setTranspose] = useState(null);
  const [error, setError] = useState('');

  // Format numbers to 4 decimal places without trailing zeros
  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    const formatted = num.toFixed(4);
    return formatted.replace(/\.?0+$/, '');
  };

  // Recreate matrix when dimensions change
  useEffect(() => {
    setMatrix(createEmptyMatrix(rows, cols));
    setTranspose(null);
    setError('');
  }, [rows, cols]);

  function createEmptyMatrix(rows, cols) {
    return Array(rows).fill().map(() => Array(cols).fill(''));
  }

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
    setTranspose(null);
    setError('');
  };

  const calculateTranspose = () => {
    // Convert to numbers and validate
    const numMatrix = matrix.map(row => 
      row.map(val => val === '' ? NaN : parseFloat(val))
    );

    if (numMatrix.some(row => row.some(isNaN))) {
      setError('Please fill all cells with numbers');
      return;
    }

    // Calculate transpose
    const transposedMatrix = Array(cols).fill().map((_, i) => 
      Array(rows).fill().map((_, j) => numMatrix[j][i])
    );

    setTranspose(transposedMatrix);
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
          Matrix Transpose Calculator
        </h1>

        {/* Dimension Selectors */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Matrix Size:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>×</span>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value)) || 1))}
                className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
              />
            </div>
          </div>
        </div>

        {/* Matrix Input Grid - Centered */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full max-w-max">
            <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
              Original Matrix ({rows}×{cols})
            </h2>
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={calculateTranspose}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={matrix.flat().some(cell => cell === '')}
          >
            Calculate Transpose
          </button>
          <button
            onClick={() => {
              setMatrix(createEmptyMatrix(rows, cols));
              setTranspose(null);
              setError('');
            }}
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
        {transpose && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Transposed Matrix ({cols}×{rows})
              </h2>
              <div className="flex justify-center">
                <BlockMath math={matrixToLatex(transpose)} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                Calculation Explanation
              </h3>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="flex justify-center">
                  <BlockMath math={`A^T = ${matrixToLatex(matrix)}^T = ${matrixToLatex(transpose)}`} />
                </div>
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