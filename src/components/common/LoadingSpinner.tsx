import "src/style/loading-spinner.css";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="loading-spinner"></div>
    </div>
  );
}
