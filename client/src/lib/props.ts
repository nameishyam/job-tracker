import type { Job, Review, User } from "@/lib/types";

export interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface AIChatProps {
  user: User | null;
}

export interface ReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ProfileCardProps {
  user: any;
  jobs: any[];
  reviews: any[];
  updateUser: (data: any) => void;
}

export interface ReviewsSectionProps {
  reviews: any[];
  setReviews: React.Dispatch<React.SetStateAction<any[]>>;
  onAddReview: () => void;
}

export interface AIResponseProps {
  responseOpen: boolean;
  onOpenChange: (responseOpen: boolean) => void;
  job: Job;
}

export interface JobInfoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

export interface RoundStatusEditorProps {
  field: {
    value: Record<string, string>;
    onChange: (val: Record<string, string>) => void;
  };
}

export interface NewRoundProps {
  field: {
    value: string[];
    onChange: (val: string[]) => void;
  };
}

export interface InfoBlockProps {
  label: React.ReactNode;
  value?: string;
  icon?: React.ReactNode;
  capitalize?: boolean;
}

export interface InfoTextBlockProps {
  value?: string;
}

export interface ReviewCardProps {
  review: Review;
}
