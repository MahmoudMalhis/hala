export default function ErrorMessage({
  message = "حدث خطأ أثناء تحميل البيانات",
  onRetry,
}) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center px-6 max-w-md">
        <div className="mb-6">
          <svg
            className="mx-auto h-20 w-20 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">عذراً!</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onRetry || (() => window.location.reload())}
          className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-semibold px-8 py-3 rounded-lg transition duration-200 inline-flex items-center gap-2"
        >
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
        </button>
      </div>
    </div>
  );
}
