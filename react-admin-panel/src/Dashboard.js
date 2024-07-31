import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stat, setStat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://contestsystembackend.onrender.com/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/login');
      }
    };
    
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchStat = async () => {
      if (user) {
        try {
          const response = await axios.get(`https://contestsystembackend.onrender.com/statistics/${user.username}`);
          setStat(response.data);
          console.log(response.data);
        } catch(error) {
          console.error('Failed to get user statistics: ', error);
          // Set default stats if there's an error (likely no submissions)
          setStat({
            total_submissions: 0,
            correct_submissions: 0,
            correct_percentage: 0
          });
        }
      }
    };
    
    fetchStat();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (!user || !stat) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const correctPercentage = Math.round(stat.correct_percentage) || 0;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-600">
          <h1 className="text-2xl font-bold text-white">Welcome, {user.username}!</h1>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Submission Statistics</h2>
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Submissions</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.total_submissions}</dd>
                </div>
                <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Correct Submissions</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{Math.round(stat.correct_submissions)}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Accuracy</h2>
              <div className="mt-5 relative">
                <div className="flex items-center justify-center">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-gray-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-blue-600"
                      strokeWidth="10"
                      strokeDasharray={360}
                      strokeDashoffset={360 - (360 * correctPercentage) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold text-blue-600">{correctPercentage}%</span>
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">Correct Percentage</p>
              </div>
            </div>
          </div>
          {stat.total_submissions === 0 && (
            <div className="mt-6 text-center text-gray-500">
              <p>You haven't made any submissions yet. Start participating in quizzes to see your statistics!</p>
            </div>
          )}
        </div>
        <div className="px-4 py-4 sm:px-6 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}