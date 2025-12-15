import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

// Hook for Grades
export const useGrades = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const grades = await apiClient.getGrades();
        
        // Validate that grades is an array
        if (!Array.isArray(grades)) {
          console.error('Grades response is not an array:', grades);
          setData([]);
          setError('Invalid data format received from server');
          return;
        }
        
        // Transform data to match expected format
        const transformedGrades = grades.map(grade => ({
          id: grade._id,
          grade: grade.grade,
          course: grade.course?.name || 'Unknown',
          student: {
            firstname: grade.student?.firstName || '',
            lastname: grade.student?.lastName || ''
          },
          date: grade.date ? new Date(grade.date).toLocaleDateString('en-US') : ''
        }));
        
        setData(transformedGrades);
        setError(null);
      } catch (err) {
        console.error('Error fetching grades:', err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return { data, loading, error };
};

// Hook for Students
export const useStudents = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching students...');
        const students = await apiClient.getStudents();
        
        console.log('📥 Students received:', students);
        
        // Validate that students is an array
        if (!Array.isArray(students)) {
          console.error('Students response is not an array:', students);
          setData([]);
          setError('Invalid data format received from server');
          return;
        }
        
        // Transform data to match expected format
        const transformedStudents = students.map(student => ({
          id: student._id,
          firstname: student.firstName,
          lastname: student.lastName,
          email: student.email
        }));
        
        console.log('✅ Transformed students:', transformedStudents);
        setData(transformedStudents);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching students:', err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { data, loading, error };
};

// Hook for Courses
export const useCourses = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const courses = await apiClient.getCourses();
        
        // Validate that courses is an array
        if (!Array.isArray(courses)) {
          console.error('Courses response is not an array:', courses);
          setData([]);
          setError('Invalid data format received from server');
          return;
        }
        
        // Transform data to match expected format
        const transformedCourses = courses.map(course => ({
          id: course._id,
          name: course.name,
          code: course.code
        }));
        
        setData(transformedCourses);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { data, loading, error };
};

// Hook for Users (can be disabled for roles sans droits)
export const useUsers = (enabled = true) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await apiClient.getUsers();
        
        if (!Array.isArray(users)) {
          console.error('Users response is not an array:', users);
          setData([]);
          setError('Invalid data format received from server');
          return;
        }
        
        const transformedUsers = users.map(user => ({
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }));
        
        setData(transformedUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [enabled]);

  return { data, loading, error };
};