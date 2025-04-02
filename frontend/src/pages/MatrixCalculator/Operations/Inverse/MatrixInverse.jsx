import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import './MatrixInverse.css';

export default function MatrixInverse() {
  const [size, setSize] = useState(2);
  const [matrix, setMatrix] = useState(createEmptyMatrix(2));
  const [inverse, setInverse] = useState(null);
  const [error, setError] = useState('');
  const [calculationSteps, setCalculationSteps] = useState([]);

  function createEmptyMatrix(size) {
    return Array(size).fill().map(() => Array(size).fill(''));
  }

  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    const rounded = Math.round(num * 10000) / 10000;
    return rounded.toString().replace(/\.?0+$/, '');
  };

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
    setInverse(null);
    setError('');
    setCalculationSteps([]);
  };

  const calculateInverse = () => {
    const numMatrix = matrix.map(row => 
      row.map(val => val === '' ? NaN : parseFloat(val))
    );

    if (numMatrix.some(row => row.some(isNaN))) {
      setError('Please fill all cells with numbers');
      return;
    }

    const n = numMatrix.length;
    const steps = [];
    
    steps.push({
      title: 'Original Matrix',
      content: <BlockMath math={matrixToLatex(numMatrix)} />
    });

    let augMatrix = numMatrix.map((row, i) => [
      ...row,
      ...Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))
    ]);

    steps.push({
      title: 'Augmented Matrix [A|I]',
      content: <BlockMath math={augmentedMatrixToLatex(augMatrix, n)} />
    });

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augMatrix[j][i]) > Math.abs(augMatrix[maxRow][i])) {
          maxRow = j;
        }
      }

      if (maxRow !== i) {
        [augMatrix[i], augMatrix[maxRow]] = [augMatrix[maxRow], augMatrix[i]];
        steps.push({
          content: (
            <div className="text-center">
              <BlockMath math={`R_{${i+1}} \\leftrightarrow R_{${maxRow+1}}`} />
              <BlockMath math={augmentedMatrixToLatex(augMatrix, n)} />
            </div>
          )
        });
      }

      if (Math.abs(augMatrix[i][i]) < 1e-10) {
        setError('Matrix is singular (determinant = 0) - no inverse exists');
        return;
      }

      const pivot = augMatrix[i][i];
      if (pivot !== 1) {
        for (let j = i; j < 2 * n; j++) {
          augMatrix[i][j] /= pivot;
        }
        steps.push({
          content: (
            <div className="text-center">
              <BlockMath math={`R_{${i+1}} = \\frac{1}{${formatNumber(pivot)}} R_{${i+1}}`} />
              <BlockMath math={augmentedMatrixToLatex(augMatrix, n)} />
            </div>
          )
        });
      }

      for (let j = 0; j < n; j++) {
        if (j !== i && augMatrix[j][i] !== 0) {
          const factor = augMatrix[j][i];
          for (let k = i; k < 2 * n; k++) {
            augMatrix[j][k] -= factor * augMatrix[i][k];
          }
          steps.push({
            content: (
              <div className="text-center">
                <BlockMath math={`R_{${j+1}} = R_{${j+1}} - ${formatNumber(factor)} \\times R_{${i+1}}`} />
                <BlockMath math={augmentedMatrixToLatex(augMatrix, n)} />
              </div>
            )
          });
        }
      }
    }

    const invMatrix = augMatrix.map(row => row.slice(n));
    setInverse(invMatrix);
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

  function augmentedMatrixToLatex(matrix, n) {
    const rows = matrix.map(row => {
      const left = row.slice(0, n).map(val => formatNumber(val)).join(' & ');
      const right = row.slice(n).map(val => formatNumber(val)).join(' & ');
      return `${left} & | & ${right}`;
    }).join(' \\\\ ');
    return `\\left(\\begin{array}{${'c'.repeat(n)}|${'c'.repeat(n)}} ${rows} \\end{array}\\right)`;
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-grow p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-math-pi mb-4 text-center">
          Matrix Inverse Calculator
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
            {[2, 3, 4, 5, 6, 7, 8].map(n => (
              <option key={n} value={n}>{n}×{n}</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
            Input Matrix ({size}×{size})
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

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={calculateInverse}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={matrix.flat().some(cell => cell === '')}
          >
            Calculate Inverse
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

        {inverse && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Inverse Matrix
              </h2>
              <div className="flex justify-center">
                <BlockMath math={matrixToLatex(inverse)} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                Calculation Process
              </h3>
              <div className="space-y-4">
                {calculationSteps.map((step, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                    {step.title && <h4 className="font-medium text-math-blue mb-1 text-center">{step.title}</h4>}
                    <div className="text-center">
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