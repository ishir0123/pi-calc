import { Link } from 'react-router-dom';
import AdBanner from '../../components/AdBanner/AdBanner';

export default function NumericalAnalysis() {
  const numericalMethods = [
    {
      title: "Bisection Method",
      path: "/numerical/bisection",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Newton-Raphson Method",
      path: "/numerical/newton-raphson",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Secant Method",
      path: "/numerical/secant",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
    },
    {
      title: "Fixed-Point Iteration",
      path: "/numerical/fixed-point",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <main className="flex-grow p-6 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-math-pi mb-6 text-center">
          Numerical Analysis Calculators
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {numericalMethods.map((method, index) => (
            <Link
              key={index}
              to={method.path}
              className="px-6 py-4 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex flex-col items-center"
            >
              {method.icon}
              <span className="text-center font-medium">{method.title}</span>
              <span className="text-sm text-blue-100 mt-1 text-center">{method.description}</span>
            </Link>
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