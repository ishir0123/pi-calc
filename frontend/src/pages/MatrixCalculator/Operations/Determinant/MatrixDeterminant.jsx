import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../../../../components/AdBanner/AdBanner';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './MatrixDeterminant.css';

export default function MatrixDeterminant() {
  const [size, setSize] = useState(2);
  const [matrix, setMatrix] = useState(createEmptyMatrix(2));
  const [determinant, setDeterminant] = useState(null);
  const [error, setError] = useState('');
  const [calculationSteps, setCalculationSteps] = useState([]);

  function createEmptyMatrix(size) {
    return Array(size).fill().map(() => Array(size).fill(''));
  }

  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    const formatted = num.toFixed(4);
    return formatted.replace(/\.?0+$/, '');
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
    setDeterminant(null);
    setError('');
    setCalculationSteps([]);
  };

  const calculateDeterminant = () => {
    const numMatrix = matrix.map(row => 
      row.map(val => val === '' ? NaN : parseFloat(val))
    );

    if (numMatrix.some(row => row.some(isNaN))) {
      setError('Please fill all cells with numbers');
      return;
    }

    const steps = [];
    steps.push({
      title: 'Input Matrix',
      content: <BlockMath math={matrixToLatex(numMatrix)} />
    });

    let det;
    if (size === 2) {
      det = numMatrix[0][0] * numMatrix[1][1] - numMatrix[0][1] * numMatrix[1][0];
      steps.push({
        title: '2×2 Determinant Formula',
        content: <BlockMath math={`\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc`} />
      });
      steps.push({
        title: 'Calculation',
        content: <BlockMath math={`${numMatrix[0][0]} \\times ${numMatrix[1][1]} - ${numMatrix[0][1]} \\times ${numMatrix[1][0]} = ${formatNumber(det)}`} />
      });
    } 
    else if (size === 3) {
      const [a, b, c] = numMatrix[0];
      const [d, e, f] = numMatrix[1];
      const [g, h, i] = numMatrix[2];
      
      det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
      
      steps.push({
        title: '3×3 Determinant (Sarrus Rule)',
        content: (
          <BlockMath math={`
            \\begin{vmatrix} 
              a & b & c \\\\ 
              d & e & f \\\\ 
              g & h & i 
            \\end{vmatrix} 
            = a(ei - fh) - b(di - fg) + c(dh - eg)
          `}
          />
        )
      });
      
      steps.push({
        title: 'Calculation',
        content: (
          <BlockMath math={`
            ${a}(${e}\\times${i} - ${f}\\times${h}) - 
            ${b}(${d}\\times${i} - ${f}\\times${g}) + 
            ${c}(${d}\\times${h} - ${e}\\times${g}) = ${formatNumber(det)}
          `}
          />
        )
      });
    }
    else {
      det = calculateNxNDeterminant(numMatrix);
      steps.push({
        title: 'Note',
        content: 'For matrices 4×4 and larger, we show only the final result due to computational complexity.'
      });
    }

    setDeterminant(det);
    setCalculationSteps(steps);
  };

  function calculateNxNDeterminant(matrix) {
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
      const minor = matrix
        .filter((_, row) => row !== 0)
        .map(row => row.filter((_, col) => col !== i));
      const sign = i % 2 === 0 ? 1 : -1;
      det += sign * matrix[0][i] * calculateNxNDeterminant(minor);
    }
    return det;
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
          Matrix Determinant Calculator
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

        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-math-blue mb-3 text-center">
              Input Matrix ({size}×{size})
            </h2>
            <div className="matrix-grid-container">
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

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={calculateDeterminant}
            className="px-4 py-2 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={matrix.flat().some(cell => cell === '')}
          >
            Calculate Determinant
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

        {determinant !== null && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <h2 className="text-lg font-semibold text-math-blue mb-3">
                Determinant
              </h2>
              <div className="flex justify-center">
                <BlockMath math={`\det = ${formatNumber(determinant)}`} />
              </div>
            </div>

            {size <= 3 ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                  Calculation Process
                </h3>
                <div className="space-y-4 mx-auto max-w-3xl">
                  {calculationSteps.map((step, index) => (
                    <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                      {step.title && (
                        <h4 className="font-medium text-math-blue mb-1 text-center">
                          {typeof step.title === 'string' ? step.title : step.title}
                        </h4>
                      )}
                      <div className="flex justify-center">
                        <div className="text-center">
                          {step.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 text-center">
                <p className="text-yellow-700 text-sm">
                  For matrices 4×4 and larger, we show only the final result due to computational complexity.
                </p>
              </div>
            )}
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