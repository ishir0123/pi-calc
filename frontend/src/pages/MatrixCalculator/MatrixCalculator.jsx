import { Link } from 'react-router-dom';
import AdBanner from '../../components/AdBanner/AdBanner';

export default function MatrixCalculator() {
  const operations = [
    {
      title: "Matrix Addition",
      path: "/matrix/matrix-addition",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Subtraction",
      path: "/matrix/matrix-subtraction",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Multiplication",
      path: "/matrix/matrix-multiplication",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Inverse",
      path: "/matrix/matrix-inverse",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Transpose",
      path: "/matrix/matrix-transpose",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Trace",
      path: "/matrix/matrix-trace",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Eigenvalues",
      path: "/matrix/matrix-eigenvalues",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Norm",
      path: "/matrix/matrix-norm",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Pseudoinverse",
      path: "/matrix/matrix-pseudoinverse",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V11m0 10l-7-7m7 7l7-7" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix RREF",
      path: "/matrix/matrix-rref",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l7 7-7 7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Rank",
      path: "/matrix/matrix-rank",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      available: true
    },
    {
      title: "Row Space",
      path: "/matrix/row-space",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      ),
      available: true
    },
    {
      title: "Column Space",
      path: "/matrix/column-space",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      available: true
    },
    {
      title: "Matrix Determinant",
      path: "/matrix/matrix-determinant",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      available: true
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <main className="flex-grow p-6 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-math-pi mb-6 text-center">
          Matrix Calculators
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {operations.map((op, index) => (
            op.available ? (
              <Link
                key={index}
                to={op.path}
                className="px-6 py-4 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex flex-col items-center"
              >
                {op.icon}
                <span>{op.title}</span>
              </Link>
            ) : (
              <div
                key={index}
                className="px-6 py-4 bg-gray-300 text-gray-700 rounded-lg transition-colors flex flex-col items-center cursor-not-allowed"
              >
                {op.icon}
                <span>{op.title}</span>
                <span className="text-xs mt-1">(Coming Soon)</span>
              </div>
            )
          ))}
        </div>
      </main>

      {/* Right Sidebar Ad */}
      <div className="hidden md:block w-[160px] shrink-0 sticky top-4 h-[600px] mr-4">
        <AdBanner 
          location="right" 
          dimensions="160x600"
          className="h-full"
        />
      </div>
    </div>
  );
}