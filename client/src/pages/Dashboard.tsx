import AIChat from "@/components/AIChat";
import JobCard from "@/components/JobCard";
import JobForm from "@/components/JobForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [open, setOpen] = useState<boolean>(false);
  const { jobs, user } = useAuth();

  return (
    <div className="min-h-[80vh] p-4 flex overflow-hidden">
      <div className="w-1/2 h-full bg-background p-6 flex flex-col">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex flex-col">
            <div className="text-2xl flex flex-row font-bold gap-1">
              <div>Job</div>
              <div className="text-primary">Dashboard</div>
            </div>
            <div>
              Track your applications, interviews, and insights from one place.
            </div>
          </div>

          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <PlusIcon />
            Add Application
          </Button>

          <JobForm open={open} onOpenChange={setOpen} />
        </div>

        <div className="flex-1 flex items-center justify-center">
          {jobs.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No job applications found. Click "Add Application" to get started!
            </div>
          ) : (
            <div className="w-full space-y-4 overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="h-full bg-background overflow-y-auto  p-6">
          <h2 className="text-2xl font-bold">Personal Assistant</h2>
          <AIChat user={user} />
        </div>
      </div>
    </div>
  );
}
