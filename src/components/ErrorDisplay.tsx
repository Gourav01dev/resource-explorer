interface ErrorDisplayProps {
    error: Error;
    retry: () => void;
}

export const ErrorDisplay = ({ error, retry }: ErrorDisplayProps) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <button onClick={retry} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                Try Again
            </button>
        </div>
    );
};
