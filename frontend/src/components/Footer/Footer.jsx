export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Pi-Calculator. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="/about" className="hover:text-math-pi transition-colors">
              About
            </a>
            <a href="/privacy" className="hover:text-math-pi transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    );
  }