import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <div className="relative">
        <nav className="w-full bg-gradient-to-r from-orange-800 to-yellow-700 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-yellow-100 hover:text-yellow-200 cursor-pointer transition-colors">
                  Macanan
                </div>
              </div>

              <div className="hidden md:block text-2xl font-bold text-yellow-100">
                Man vs Tiger
              </div>

              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg 
                       transition-all duration-300 transform hover:scale-105
                       shadow-md hover:shadow-lg"
              >
                Exit Game
              </button>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600"></div>
        </nav>
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
