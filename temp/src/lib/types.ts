export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  profile_url?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Job {
  id?: string;
  title?: string;
  company?: string;
  status?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  login: (user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  loading: boolean;
}
