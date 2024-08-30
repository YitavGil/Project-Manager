export interface Project {
    id: number;
    name: string;
    description: string;
    userId: string;
  }
  
  export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    projectId: number;
    userId: string;
  }
  
  export interface User {
    username: string;
    email: string;
  }