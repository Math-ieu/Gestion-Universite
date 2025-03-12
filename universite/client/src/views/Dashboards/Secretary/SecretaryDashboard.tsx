import React from 'react';
import { Layout } from '../../components/Layout';
import { BookOpen, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecretaryDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Secretary Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/secretary/courses"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Manage Courses</h2>
                <p className="text-gray-500">Create and manage course offerings</p>
              </div>
            </div>
          </Link>

          <Link
            to="/secretary/teachers"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Manage Teachers</h2>
                <p className="text-gray-500">Assign and manage teaching staff</p>
              </div>
            </div>
          </Link>

          <Link
            to="/secretary/semester-courses"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Semester Courses</h2>
                <p className="text-gray-500">Plan semester course schedules</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded hover:bg-gray-100">
              Create New Course
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded hover:bg-gray-100">
              Assign Teacher to Course
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded hover:bg-gray-100">
              View Course Schedule
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};