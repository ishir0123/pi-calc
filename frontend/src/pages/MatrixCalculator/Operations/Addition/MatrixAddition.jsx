import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import './MatrixAddition.css';

export default function MatrixAddition() {
  // Matrix dimensions
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrixA, setMatrixA] = useState(createEmptyMatrix(rows, cols));
  const [matrixB, setMatrixB] = useState(createEmptyMatrix(rows, cols));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function createEmptyMatrix(rows, cols) {
    return Array(rows).fill().map(() => Array(cols).fill(''));
  }

  const handleRowsChange = (e) => {
    const newRows = parseInt(e.target.value);
    setRows(newRows);
    setMatrixA(createEmptyMatrix(newRows, cols));
    setMatrixB(createEmptyMatrix(newRows, cols));
    resetResults();
  };

  const handleColsChange = (e) => {
    const newCols = parseInt(e.target.value);
    setCols(newCols);
    setMatrixA(createEmptyMatrix(rows, newCols));
    setMatrixB(createEmptyMatrix(rows, newCols));
    resetResults();
  };

  const handleMatrixChange = (matrix, setMatrix, row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
    resetResults();
  };

  const calculateAddition = () => {
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

    // Perform addition
    const sumMatrix = numMatrixA.map((row, i) => 
      row.map((val, j) => val + numMatrixB[i][j])
    );

    setResult(sumMatrix);
  };

  const resetResults = () => {
    setResult(null);
    setError('');
  };

  function matrixToLatex(matrix) {
    const rows = matrix.map(row => 
      row.map(val => {
        if (typeof val !== 'number') return val;
        // Format numbers to 4 decimal places if not integer
        const formatted = val.toFixed(4);
        return formatted.replace(/\.?0+$/, '');
      }).join(' & ')
    ).join(' \\\\ ');
    return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-grow p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-math-pi mb-4 text-center">
          Matrix Addition Calculator
        </h1>

        {/* Dimension Selectors */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Rows:</label>
            <select 
              value={rows}
              onChange={handleRowsChange}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={`rows-${n}`} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Columns:</label>
            <select 
              value={cols}
              onChange={handleColsChange}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={`cols-${n}`} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Matrix A */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
              Matrix A ({rows}×{cols})
            </h2>
            <div className="matrix-grid-container">
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
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
              Matrix B ({rows}×{cols})
            </h2>
            <div className="matrix-grid-container">
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

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={calculateAddition}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={
              matrixA.flat().some(cell => cell === '') || 
              matrixB.flat().some(cell => cell === '')
            }
          >
            Calculate A + B
          </button>
          <button
            onClick={() => {
              setMatrixA(createEmptyMatrix(rows, cols));
              setMatrixB(createEmptyMatrix(rows, cols));
              resetResults();
            }}
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

        {result && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Result (A + B) ({rows}×{cols})
              </h2>
              <div className="flex justify-center">
                <BlockMath math={matrixToLatex(result)} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Calculation Process
              </h3>
              <div className="space-y-2 mx-auto max-w-md">
                <div className="bg-white p-3 rounded-md shadow-sm flex justify-center">
                  <BlockMath math={`A = ${matrixToLatex(matrixA)}`} />
                </div>
                <div className="text-xl">+</div>
                <div className="bg-white p-3 rounded-md shadow-sm flex justify-center">
                  <BlockMath math={`B = ${matrixToLatex(matrixB)}`} />
                </div>
                <div className="text-xl">=</div>
                <div className="bg-white p-3 rounded-md shadow-sm flex justify-center">
                  <BlockMath math={`${matrixToLatex(result)}`} />
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