import React from 'react';
import { Layout } from '../../components/Layout';
import { BookOpen, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/student/courses"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Course Registration</h2>
                <p className="text-gray-500">Register for new courses</p>
              </div>
            </div>
          </Link> 

          <Link
            to="/student/exercises"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Submit Exercises</h2>
                <p className="text-gray-500">View and submit course exercises</p>
              </div>
            </div>
          </Link>

          <Link
            to="/student/questions"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <HelpCircle className="h-8 w-8 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Ask Questions</h2>
                <p className="text-gray-500">Get help from teachers</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Mathematics Assignment</h3>
                    <p className="text-sm text-gray-500">Due in 2 days</p>
                  </div>
                  <span className="text-sm text-red-500">High Priority</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Physics Lab Report</h3>
                    <p className="text-sm text-gray-500">Due in 5 days</p>
                  </div>
                  <span className="text-sm text-yellow-500">Medium Priority</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Grades</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Chemistry Quiz</h3>
                    <p className="text-sm text-gray-500">Grade: A</p>
                  </div>
                  <span className="text-sm text-green-500">95%</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Literature Essay</h3>
                    <p className="text-sm text-gray-500">Grade: B+</p>
                  </div>
                  <span className="text-sm text-green-500">88%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};