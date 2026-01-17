import type { Job } from "@/lib/types";

export interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export interface InfoBlockProps {
  label: React.ReactNode;
  value?: string;
  icon?: React.ReactNode;
  capitalize?: boolean;
}

export interface InfoTextBlockProps {
  label: string;
  value?: string;
}
