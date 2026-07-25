function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <p className="text-gray-500 mt-2">Welcome back, Dayana 👋</p>

      <div className="grid grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Products</h3>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Orders</h3>
          <p className="text-3xl font-bold mt-2">53</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Users</h3>
          <p className="text-3xl font-bold mt-2">340</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-3xl font-bold mt-2">$3200</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
