export default function NotFound() {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
          <p className="text-xl mt-4 text-gray-700">
            Oops! The page you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }
  