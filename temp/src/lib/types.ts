export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  profile_url?: string;
  createdAt?: Date;
  [key: string]: any;
}

export interface Job {
  id?: string;
  userId?: string;
  jobtitle?: string;
  company?: string;
  location?: string;
  jobtype?: string;
  salary?: string;
  description?: string;
  dateApplied?: Date;
  review?: string;
  roundStatus?: Record<string, string>;
  updatedAt?: Date;
  status?: string;
  [key: string]: any;
}

export interface Review {
  id?: string;
  userId?: string;
  company?: string;
  review?: string;
  rating?: number;
  salary?: string;
  rounds?: string[];
  role?: string;
  updatedAt?: Date;
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
