import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import './Rank.css';

export default function Rank() {
  const [rows, setRows] = useState(2);  // Default 2x2
  const [cols, setCols] = useState(2);
  const [matrix, setMatrix] = useState(createEmptyMatrix(2, 2));
  const [rank, setRank] = useState(null);
  const [rref, setRref] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

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
    setRank(null);
    setRref(null);
    setSteps([]);
    setError('');
  };

  const calculateRank = () => {
    const numMatrix = matrix.map(row => 
      row.map(val => val === '' ? NaN : parseFloat(val))
    );

    if (numMatrix.some(row => row.some(isNaN))) {
      setError('Please fill all cells with numbers');
      return;
    }

    const { rrefMatrix, rank, steps } = computeRREF([...numMatrix]);
    setRref(rrefMatrix);
    setRank(rank);
    setSteps(steps);
  };

  function computeRREF(matrix) {
    let rank = 0;
    const steps = [];
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    let lead = 0;

    const rrefMatrix = matrix.map(row => [...row]);

    // Only show original matrix as first step
    steps.push({
      title: 'Original Matrix',
      content: <BlockMath math={matrixToLatex(rrefMatrix)} />
    });

    for (let r = 0; r < numRows; r++) {
      if (lead >= numCols) break;

      let i = r;
      while (Math.abs(rrefMatrix[i][lead]) < 1e-10) {
        i++;
        if (i === numRows) {
          i = r;
          lead++;
          if (lead === numCols) break;
        }
      }

      if (i !== r) {
        [rrefMatrix[r], rrefMatrix[i]] = [rrefMatrix[i], rrefMatrix[r]];
        steps.push({
          content: (
            <>
              <BlockMath math={`R_{${r+1}} \\leftrightarrow R_{${i+1}}`} />
              <BlockMath math={matrixToLatex(rrefMatrix)} />
            </>
          )
        });
      }

      const pivot = rrefMatrix[r][lead];
      if (Math.abs(pivot) > 1e-10) {
        rank++;
        
        // Skip showing R = (1/1)R operations
        if (Math.abs(pivot - 1) > 1e-10) {
          for (let j = lead; j < numCols; j++) {
            rrefMatrix[r][j] /= pivot;
          }
          steps.push({
            content: (
              <>
                <BlockMath math={`R_{${r+1}} = \\frac{1}{${formatNumber(pivot)}} R_{${r+1}}`} />
                <BlockMath math={matrixToLatex(rrefMatrix)} />
              </>
            )
          });
        }

        for (let i = 0; i < numRows; i++) {
          if (i !== r && Math.abs(rrefMatrix[i][lead]) > 1e-10) {
            const factor = rrefMatrix[i][lead];
            for (let j = lead; j < numCols; j++) {
              rrefMatrix[i][j] -= factor * rrefMatrix[r][j];
            }
            
            // Improved equation formatting with brackets
            const operation = factor < 0 
              ? `R_{${i+1}} = R_{${i+1}} - (${formatNumber(-factor)} R_{${r+1}})` 
              : `R_{${i+1}} = R_{${i+1}} - ${formatNumber(factor)} R_{${r+1}}`;
            
            steps.push({
              content: (
                <>
                  <BlockMath math={operation} />
                  <BlockMath math={matrixToLatex(rrefMatrix)} />
                </>
              )
            });
          }
        }
        lead++;
      }
    }

    return { rrefMatrix, rank, steps };
  }

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
          Matrix Rank Calculator (Using RREF)
        </h1>

        {/* Centered Dimension Selectors */}
        <div className="flex justify-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Rows:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={rows}
              onChange={(e) => handleSizeChange('rows', e.target.value)}
              className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Columns:</span>
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

        {/* Centered Matrix Input */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
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

        {/* Centered Action Buttons */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={calculateRank}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={matrix.flat().some(cell => cell === '')}
          >
            Calculate Rank
          </button>
          <button
            onClick={resetResults}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 text-center">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {rank !== null && (
          <div className="space-y-4">
            {/* Changed result color to black */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-black mb-3"> {/* Changed to black */}
                Matrix Rank: <span className="text-2xl font-bold">{rank}</span>
              </h2>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Reduced Row Echelon Form (RREF)
              </h2>
              <div className="flex justify-center">
                <BlockMath math={matrixToLatex(rref)} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                RREF Calculation Steps
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                    {step.title && (
                      <h4 className="font-medium text-math-blue mb-1 text-center">
                        {step.title}
                      </h4>
                    )}
                    <div className="flex flex-col items-center">
                      {step.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Link 
            to="/matrix" 
            className="text-math-blue hover:underline font-medium text-sm"
          >
            ← Back to Matrix Calculators
          </Link>
        </div>
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