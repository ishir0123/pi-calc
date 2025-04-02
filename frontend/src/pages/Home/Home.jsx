// src/pages/Home/Home.jsx
import AdBanner from "../../components/AdBanner/AdBanner";

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <main className="flex-grow p-6 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-math-pi mb-6 text-center">
          Welcome to Pi-Calculator
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a 
            href="/matrix" 
            className="px-6 py-3 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Matrix Calculator
          </a>
          <a 
            href="/numerical"
            className="px-6 py-3 bg-math-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Numerical Analysis
          </a>
        </div>
      </main>

      {/* Right Sidebar - 160px Skyscraper */}
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