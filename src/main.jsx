import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import store from './redux/store';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import MainGame from './pages/MainGame';
import './index.css'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar></Navbar>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: 'MainGame',
        element: <MainGame></MainGame>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);
