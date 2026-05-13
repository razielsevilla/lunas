export default function ExpertDashboard() {
  return (
    <div className="flex h-screen">
      {/* Fixed-width dark sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul className="space-y-4">
            <li className="cursor-pointer hover:bg-gray-700 p-2 rounded">Overview</li>
            <li className="cursor-pointer hover:bg-gray-700 p-2 rounded">Reports</li>
            <li className="cursor-pointer hover:bg-gray-700 p-2 rounded">Settings</li>
            <li className="cursor-pointer hover:bg-gray-700 p-2 rounded">Help</li>
          </ul>
        </nav>
      </aside>

      {/* Light-themed main content area */}
      <main className="flex-1 bg-gray-50 p-6">
        {/* Status banner */}
        <div className="mb-6">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Verified
          </span>
        </div>

        {/* Main greeting */}
        <h1 className="font-serif font-bold text-3xl mb-6 text-gray-800">
          Good evening, Expert
        </h1>

        {/* 2x2 responsive grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-5xl font-sans font-bold text-gray-900 mb-2">1,234</div>
            <div className="text-lg text-gray-600 mb-1">Active Users</div>
            <div className="text-sm text-green-600 font-medium">+12% vs last month</div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-5xl font-sans font-bold text-gray-900 mb-2">$5,678</div>
            <div className="text-lg text-gray-600 mb-1">Monthly Revenue</div>
            <div className="text-sm text-green-600 font-medium">+8% vs last month</div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-5xl font-sans font-bold text-gray-900 mb-2">89</div>
            <div className="text-lg text-gray-600 mb-1">New Projects</div>
            <div className="text-sm text-red-600 font-medium">-3% vs last month</div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-5xl font-sans font-bold text-gray-900 mb-2">456</div>
            <div className="text-lg text-gray-600 mb-1">Support Tickets</div>
            <div className="text-sm text-green-600 font-medium">+15% vs last month</div>
          </div>
        </div>
      </main>
    </div>
  );
}