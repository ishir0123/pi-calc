import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './MatrixRREF.css';

export default function MatrixRREF() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrix, setMatrix] = useState(Array(2).fill().map(() => Array(2).fill('')));
  const [rref, setRref] = useState(null);
  const [error, setError] = useState('');
  const [steps, setSteps] = useState([]);

  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    const formatted = num.toFixed(4);
    return formatted.replace(/\.?0+$/, '');
  };

  const handleSizeChange = (dimension, value) => {
    const numValue = Math.max(1, Math.min(10, parseInt(value) || 2));
    if (dimension === 'rows') {
      setRows(numValue);
      setMatrix(Array(numValue).fill().map(() => Array(cols).fill('')));
    } else {
      setCols(numValue);
      setMatrix(Array(rows).fill().map(() => Array(numValue).fill('')));
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
    setRref(null);
    setError('');
    setSteps([]);
  };

  const calculateRREF = () => {
    const numMatrix = matrix.map(row => 
      row.map(val => val === '' ? NaN : parseFloat(val))
    );

    if (numMatrix.flat().some(isNaN)) {
      setError('Please fill all cells with numbers');
      return;
    }

    const calculationSteps = [];
    let currentMatrix = JSON.parse(JSON.stringify(numMatrix));
    const rowCount = numMatrix.length;
    const colCount = numMatrix[0].length;

    let lead = 0;
    for (let r = 0; r < rowCount; r++) {
      if (lead >= colCount) break;

      let i = r;
      while (currentMatrix[i][lead] === 0) {
        i++;
        if (i === rowCount) {
          i = r;
          lead++;
          if (lead === colCount) break;
        }
      }

      if (i !== r) {
        [currentMatrix[i], currentMatrix[r]] = [currentMatrix[r], currentMatrix[i]];
        calculationSteps.push({
          operation: `R_{${r+1}} \\leftrightarrow R_{${i+1}}`,
          matrix: matrixToLatex(currentMatrix)
        });
      }

      const div = currentMatrix[r][lead];
      if (div !== 0 && div !== 1) {
        for (let j = 0; j < colCount; j++) {
          currentMatrix[r][j] /= div;
        }
        calculationSteps.push({
          operation: `R_{${r+1}} = \\frac{1}{${formatNumber(div)}} R_{${r+1}}`,
          matrix: matrixToLatex(currentMatrix)
        });
      }

      for (let i = 0; i < rowCount; i++) {
        if (i !== r && currentMatrix[i][lead] !== 0) {
          const factor = currentMatrix[i][lead];
          for (let j = 0; j < colCount; j++) {
            currentMatrix[i][j] -= factor * currentMatrix[r][j];
          }
          calculationSteps.push({
            operation: `R_{${i+1}} = R_{${i+1}} - ${formatNumber(factor)} \\times R_{${r+1}}`,
            matrix: matrixToLatex(currentMatrix)
          });
        }
      }
      lead++;
    }

    currentMatrix = currentMatrix.map(row => 
      row.map(val => Math.round(val * 10000) / 10000)
    );

    setRref(currentMatrix);
    setSteps(calculationSteps);
  };

  function matrixToLatex(matrix) {
    const rows = matrix.map(row => 
      row.map(val => formatNumber(val)).join(' & ')
    ).join(' \\\\ ');
    return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-grow p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-math-pi mb-4 text-center">
          Matrix RREF Calculator
        </h1>

        <div className="flex justify-center items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
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

        {/* Centered and properly aligned matrix input */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 inline-block">
            <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
              Input Matrix ({rows}×{cols})
            </h2>
            <div className="flex flex-col items-center">
              {matrix.map((row, i) => (
                <div key={`row-${i}`} className="flex justify-center mb-1 last:mb-0">
                  {row.map((val, j) => (
                    <input
                      key={`${i}-${j}`}
                      type="number"
                      value={val}
                      onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                      className="w-16 h-10 px-2 mx-1 text-center border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      step="any"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={calculateRREF}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={matrix.flat().some(cell => cell === '')}
          >
            Calculate RREF
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

        {rref && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Reduced Row Echelon Form
              </h2>
              <div className="flex justify-center">
                <BlockMath math={matrixToLatex(rref)} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                Calculation Steps
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                    <div className="text-center mb-2">
                      <BlockMath math={step.operation} />
                    </div>
                    <div className="flex justify-center">
                      <BlockMath math={step.matrix} />
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