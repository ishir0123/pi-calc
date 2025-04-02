import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './RowSpace.css';

export default function RowSpace() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrix, setMatrix] = useState([
    ['1', '0'],
    ['0', '1']
  ]);
  const [rowSpaceBasis, setRowSpaceBasis] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    const formatted = num.toFixed(4);
    return formatted.replace(/\.?0+$/, '');
  };

  const handleSizeChange = (dimension, value) => {
    const numValue = parseInt(value) || 2;
    if (numValue < 1 || numValue > 10) return;

    if (dimension === 'rows') {
      setRows(numValue);
      setMatrix(prev => {
        const newMatrix = createEmptyMatrix(numValue, cols);
        for (let i = 0; i < Math.min(numValue, prev.length); i++) {
          for (let j = 0; j < cols; j++) {
            if (prev[i] && prev[i][j] !== undefined) {
              newMatrix[i][j] = prev[i][j];
            }
          }
        }
        return newMatrix;
      });
    } else {
      setCols(numValue);
      setMatrix(prev => {
        const newMatrix = createEmptyMatrix(rows, numValue);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < Math.min(numValue, prev[i]?.length || 0); j++) {
            newMatrix[i][j] = prev[i][j];
          }
        }
        return newMatrix;
      });
    }
    resetResults();
  };

  function createEmptyMatrix(rows, cols) {
    return Array(rows).fill().map(() => Array(cols).fill(''));
  }

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
    resetResults();
  };

  const resetResults = () => {
    setRowSpaceBasis(null);
    setSteps([]);
    setError('');
  };

  const calculateRowSpace = () => {
    const numMatrix = matrix.map(row => 
      row.map(val => val === '' ? NaN : parseFloat(val))
    );

    if (numMatrix.some(row => row.some(isNaN))) {
      setError('Please fill all cells with numbers');
      return;
    }

    const calculationSteps = [];
    let currentMatrix = JSON.parse(JSON.stringify(numMatrix));
    
    calculationSteps.push({
      title: 'Original Matrix',
      content: <BlockMath math={matrixToLatex(currentMatrix)} />
    });

    let rank = 0;
    for (let col = 0; col < cols && rank < rows; col++) {
      let pivotRow = rank;
      while (pivotRow < rows && Math.abs(currentMatrix[pivotRow][col]) < 1e-10) {
        pivotRow++;
      }

      if (pivotRow === rows) continue;

      if (pivotRow !== rank) {
        [currentMatrix[rank], currentMatrix[pivotRow]] = [currentMatrix[pivotRow], currentMatrix[rank]];
        calculationSteps.push({
          content: (
            <div className="text-center">
              <BlockMath math={`R_{${rank+1}} \\leftrightarrow R_{${pivotRow+1}}`} />
              <BlockMath math={matrixToLatex(currentMatrix)} />
            </div>
          )
        });
      }

      const pivotValue = currentMatrix[rank][col];
      if (Math.abs(pivotValue - 1) > 1e-10) {
        for (let j = col; j < cols; j++) {
          currentMatrix[rank][j] /= pivotValue;
        }
        calculationSteps.push({
          content: (
            <div className="text-center">
              <BlockMath math={`R_{${rank+1}} \\rightarrow \\left(\\frac{1}{${formatNumber(pivotValue)}}\\right) R_{${rank+1}}`} />
              <BlockMath math={matrixToLatex(currentMatrix)} />
            </div>
          )
        });
      }

      for (let i = 0; i < rows; i++) {
        if (i !== rank && Math.abs(currentMatrix[i][col]) > 1e-10) {
          const factor = currentMatrix[i][col];
          for (let j = col; j < cols; j++) {
            currentMatrix[i][j] -= factor * currentMatrix[rank][j];
          }
          calculationSteps.push({
            content: (
              <div className="text-center">
                <BlockMath math={`R_{${i+1}} \\rightarrow R_{${i+1}} - \\left(${formatNumber(factor)}\\right) R_{${rank+1}}`} />
                <BlockMath math={matrixToLatex(currentMatrix)} />
              </div>
            )
          });
        }
      }
      rank++;
    }

    const basis = currentMatrix.filter(row => 
      row.some(val => Math.abs(val) > 1e-10)
    );

    setRowSpaceBasis(basis);
    setSteps(calculationSteps);
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

  function basisToLatex(basis) {
    if (basis.length === 0) return "\\text{Empty set}";
    
    // For single vector, display as row matrix
    if (basis.length === 1) {
      return `\\left\\{ \\begin{pmatrix} ${basis[0].map(val => formatNumber(val)).join(' & ')} \\end{pmatrix} \\right\\}`;
    }
    
    // For multiple vectors, display as row matrices separated by commas
    const vectors = basis.map(row => 
      `\\begin{pmatrix} ${row.map(val => formatNumber(val)).join(' & ')} \\end{pmatrix}`
    ).join(', ');
    
    return `\\left\\{ ${vectors} \\right\\}`;
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-grow p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-math-pi mb-4 text-center">
          Row Space Calculator (RREF)
        </h1>

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

        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
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

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={calculateRowSpace}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={matrix.flat().some(cell => cell === '')}
          >
            Calculate Row Space
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

        {rowSpaceBasis && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Row Space Basis (from RREF)
              </h2>
              <div className="overflow-x-auto">
                <div className="inline-block">
                  <BlockMath math={basisToLatex(rowSpaceBasis)} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Dimension: {rowSpaceBasis.length}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                RREF Calculation Steps
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                    {step.title && (
                      <h4 className="font-medium text-black mb-1 text-center">
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