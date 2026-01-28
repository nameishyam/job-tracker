import { useAuth } from "@/context/AuthContext";
import type { Job } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import JobInfo from "@/components/JobInfo";
import AIResponse from "@/components/AIResponse";

export default function JobCard({ job }: Job) {
  const { setJobs } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [responseOpen, setResponseOpen] = useState<boolean>(false);

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/jobs/${job.id}`);
      toast.success("Job application deleted successfully.");
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (error) {
      toast.error("Failed to delete job application.");
      console.error("Error deleting job:", error);
    }
  };

  return (
    <>
      <Card
        className="cursor-pointer rounded-2xl bg-background border"
        onClick={() => setOpen(true)}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold truncate">
                  {job.jobtitle}
                </h3>
                {job.jobtype && <Badge>{job.jobtype}</Badge>}
              </div>

              <h4 className="text-sm sm:text-base font-medium text-muted-foreground mb-2 truncate">
                {job.company}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {job.location || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Salary:</span>{" "}
                  {job.salary || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Applied on:</span>{" "}
                  {formatDate(job.dateApplied?.toString())}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  {job.status || "Applied"}
                </div>
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setResponseOpen(true);
              }}
              className="hover:cursor-pointer"
            >
              AI Analysis
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:cursor-pointer"
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your job application.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90 hover:cursor-pointer"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      <JobInfo open={open} onOpenChange={setOpen} job={job} />
      <AIResponse
        responseOpen={responseOpen}
        onOpenChange={setResponseOpen}
        job={job}
      />
    </>
  );
}
