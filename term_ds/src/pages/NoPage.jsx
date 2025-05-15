export default function NoPage() {
  return (
    <div className="min-h-screen font-[Inter] flex items-center justify-center ">
      <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-6">Сторінку не знайдено</p>
        <p className="text-gray-600 mb-8">Вибачте, сторінка, яку ви шукаєте, не існує або була переміщена.</p>
        <a 
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
        >
          Повернутися на Головну
        </a>
      </div>
    </div>
  )
}
