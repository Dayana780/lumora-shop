function AdminHeader() {
  return (
    <header
      className="
        h-16
        bg-white
        border-b
        flex
        items-center
        justify-between
        px-6
      "
    >
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        <button className="text-xl hover:scale-110 transition">🔔</button>

        <div className="flex items-center gap-3">
          <div
            className="
              w-10
              h-10
              rounded-full
              bg-pink-100
              text-pink-600
              flex
              items-center
              justify-center
              font-bold
            "
          >
            D
          </div>

          <div>
            <p className="font-medium">Dayana</p>

            <span className="text-xs text-gray-500">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
