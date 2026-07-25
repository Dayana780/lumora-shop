import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar"; // توجه به   برای import
import Footer from "../components/common/Footer"; // توجه به { } برای import

function MainLayout() {
  return (
    <div className="p-6">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
