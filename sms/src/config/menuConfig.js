export const menuItems = [
  {
    id: 'home',
    label: 'Home',
    description: 'Random Draw',
    icon: '🏠',
    color: '#3b82f6',
    path: '/home'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Statistics',
    icon: '📊',
    color: '#10b981',
    path: '/dashboard'
  },
  {
    id: 'grades',
    label: 'Grades',
    description: 'View grades',
    icon: '📝',
    color: '#3b82f6',
    path: '/grades'
  },
  {
    id: 'students',
    label: 'Students',
    description: 'Manage students',
    icon: '👥',
    color: '#8b5cf6',
    path: '/students'
  },
  {
    id: 'courses',
    label: 'Courses',
    description: 'Manage courses',
    icon: '📚',
    color: '#06b6d4',
    path: '/courses'
  },
  {
    id: 'users',
    label: 'Users',
    description: 'Manage users',
    icon: '👤',
    color: '#f59e0b',
    path: '/users',
    roles: ['admin'] // Visible uniquement pour les admins
  },
  {
    id: 'about',
    label: 'About',
    description: 'Information',
    icon: 'ℹ️',
    color: '#f59e0b',
    path: '/about'
  },
   
];
