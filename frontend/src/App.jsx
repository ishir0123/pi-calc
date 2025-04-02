import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import MatrixCalculator from './pages/MatrixCalculator/MatrixCalculator';
import MatrixInverse from './pages/MatrixCalculator/Operations/Inverse/MatrixInverse';
import MatrixAddition from './pages/MatrixCalculator/Operations/Addition/MatrixAddition';
import MatrixSubtraction from './pages/MatrixCalculator/Operations/Subtraction/MatrixSubtraction';
import MatrixMultiplication from './pages/MatrixCalculator/Operations/Multiplication/MatrixMultiplication';
import MatrixTrace from './pages/MatrixCalculator/Operations/Trace/MatrixTrace';
import Eigenvalues from './pages/MatrixCalculator/Operations/Eigenvalues/Eigenvalues';
import MatrixNorm from './pages/MatrixCalculator/Operations/Norm/MatrixNorm';
import PseudoInverse from './pages/MatrixCalculator/Operations/PseudoInverse/PseudoInverse';
import MatrixRREF from './pages/MatrixCalculator/Operations/RREF/MatrixRREF';
import MatrixRank from './pages/MatrixCalculator/Operations/Rank/Rank';
import RowSpace from './pages/MatrixCalculator/Operations/RowSpace/RowSpace';
import ColumnSpace from './pages/MatrixCalculator/Operations/ColumnSpace/ColumnSpace';
import MatrixDeterminant from './pages/MatrixCalculator/Operations/Determinant/MatrixDeterminant';

import NumericalAnalysis from './pages/NumericalAnalysis/NumericalAnalysis';
import BisectionMethod from './pages/NumericalAnalysis/Methods/Bisection/Bisection';
import NewtonRaphson from './pages/NumericalAnalysis/Methods/NewtonRaphson/NewtonRaphson';
import SecantMethod from './pages/NumericalAnalysis/Methods/Secant/Secant';
import FixedPointIteration from './pages/NumericalAnalysis/Methods/FixedPoint/FixedPoint';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matrix" element={<MatrixCalculator />} />
          <Route path="/matrix/matrix-addition" element={<MatrixAddition />} />
          <Route path="/matrix/matrix-subtraction" element={<MatrixSubtraction />} />
          <Route path="/matrix/matrix-multiplication" element={<MatrixMultiplication />} />
          <Route path="/matrix/matrix-inverse" element={<MatrixInverse />} />
          <Route path="/matrix/matrix-trace" element={<MatrixTrace />} />
          <Route path="/matrix/matrix-eigenvalues" element={<Eigenvalues />} />
          <Route path="/matrix/matrix-norm" element={<MatrixNorm />} />
          <Route path="/matrix/matrix-pseudoinverse" element={<PseudoInverse />} />
          <Route path="/matrix/matrix-rref" element={<MatrixRREF />} />
          <Route path="/matrix/matrix-rank" element={<MatrixRank />} />
          <Route path="/matrix/row-space" element={<RowSpace />} />
          <Route path="/matrix/column-space" element={<ColumnSpace />} />
          <Route path="/matrix/matrix-determinant" element={<MatrixDeterminant />} />
          
          <Route path="/numerical" element={<NumericalAnalysis />} />
          <Route path="/numerical/bisection" element={<BisectionMethod />} />
          <Route path="/numerical/newton-raphson" element={<NewtonRaphson />} />
          <Route path="/numerical/secant" element={<SecantMethod />} />
          <Route path="/numerical/fixed-point" element={<FixedPointIteration />} />
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;