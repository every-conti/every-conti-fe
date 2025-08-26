export default function PageTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white py-8 px-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
