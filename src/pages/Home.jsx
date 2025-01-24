import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setType } from '../redux/playerSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const savedPlayerType = localStorage.getItem('playerType');
    if (!savedPlayerType) {
      navigate('/');
    } else {
      setPlayer(savedPlayerType);
    }
  }, [navigate]);

  const handlePlayerSelect = (playerType) => {
    localStorage.setItem('playerType', playerType);
    dispatch(setType(playerType));
    navigate('/MainGame');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-1/3 max-w-sm bg-white rounded-2xl shadow-2xl p-8 transform transition-transform hover:scale-105 mr-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-800 font-serif">Project AI</h2>
          <p className="mt-2 text-amber-600">Kelas B Tahun 2024-2025</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-amber-700">
            Anggota Kelompok
          </p>
          
          <p className="text-sm text-amber-700">
          - Michael Setiabudi - 222117045
          </p>
          <p className="text-sm text-amber-700">
          - Kenneth Elliot - 222117040
          </p>
          <p className="text-sm text-amber-700">
          - Yosua Christian - 222117069
          </p>
        </div>
      </div>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-transform hover:scale-105">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-800 font-serif">Pick Your Side</h2>
          <p className="mt-2 text-amber-600">Choose your role in the game</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => handlePlayerSelect("Tiger")}
            className="group relative overflow-hidden rounded-xl bg-amber-700 p-6 transition-all duration-300 hover:bg-amber-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <div className="relative z-10">
              <div className="mb-2 flex justify-center">
                <span className="text-2xl">🐯</span>
              </div>
              <p className="text-center font-serif text-lg font-semibold text-white">Tiger</p>
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-600 to-amber-800 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </button>

          <button
            onClick={() => handlePlayerSelect("Villager")}
            className="group relative overflow-hidden rounded-xl bg-emerald-700 p-6 transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <div className="relative z-10">
              <div className="mb-2 flex justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-center font-serif text-lg font-semibold text-white">Villager</p>
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-600 to-emerald-800 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-amber-700">Choose wisely - each side has unique advantages!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;