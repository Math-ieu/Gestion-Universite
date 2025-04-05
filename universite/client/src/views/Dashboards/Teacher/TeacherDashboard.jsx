import React from 'react';
import { Layout } from '../../components/Layout';
import { BookOpen, GraduationCap, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherDashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/teacher/sessions"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Manage Sessions</h2>
                <p className="text-gray-500">Schedule and manage class sessions</p>
              </div>
            </div>
          </Link>

          <Link
            to="/teacher/grades"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Manage Grades</h2>
                <p className="text-gray-500">Review and update student grades</p>
              </div>
            </div>
          </Link>

          <Link
            to="/teacher/exercises"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Exercise Grades</h2>
                <p className="text-gray-500">Grade student exercises</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Advanced Mathematics</h3>
                  <p className="text-sm text-gray-500">Room 301</p>
                </div>
                <span className="text-sm text-gray-500">09:00 AM - 10:30 AM</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Physics Lab</h3>
                  <p className="text-sm text-gray-500">Lab 2B</p>
                </div>
                <span className="text-sm text-gray-500">11:00 AM - 12:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};