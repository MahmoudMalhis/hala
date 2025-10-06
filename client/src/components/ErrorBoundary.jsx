import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#fffdf9] via-[#faf5f0] to-[#f3ece6] flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            {/* الأيقونة */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <svg
                  className="w-32 h-32 text-amber-300 mx-auto animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="absolute inset-0 bg-amber-200 opacity-20 blur-3xl rounded-full"></div>
              </div>
            </div>

            {/* النص */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 font-alexandria">
                عذراً!
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-3 font-alexandria">
                حدث خطأ غير متوقع
              </p>
              <p className="text-sm text-gray-500 mb-8 font-alexandria">
                نعتذر عن الإزعاج، يرجى المحاولة مرة أخرى
              </p>

              {/* الأزرار */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 font-alexandria"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    إعادة المحاولة
                  </span>
                </button>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl border-2 border-gray-200 transform hover:scale-105 transition duration-300 font-alexandria"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    العودة للصفحة الرئيسية
                  </span>
                </button>
              </div>

              {/* معلومات إضافية في Development */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-8 text-left bg-red-50 rounded-lg p-4">
                  <summary className="cursor-pointer text-red-600 font-semibold mb-2">
                    تفاصيل الخطأ (للمطورين)
                  </summary>
                  <pre className="text-xs text-red-800 overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>

            {/* زخرفة */}
            <div className="mt-8 text-center">
              <div className="inline-flex gap-2">
                <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
