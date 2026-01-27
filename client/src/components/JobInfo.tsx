import { useState } from "react";
import { format } from "date-fns";
import {
  Briefcase,
  MapPin,
  CalendarIcon,
  Pencil,
  Save,
  X,
  IndianRupee,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import type { JobInfoProps } from "@/lib/props";
import InfoBlock from "@/components/InfoBlock";
import InfoTextBlock from "@/components/InfoTextBlock";
import type { Job } from "@/lib/types";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function safeDate(value?: Date | string) {
  if (!value) return null;
  const d = typeof value === "string" ? new Date(value) : value;
  return isNaN(d.getTime()) ? null : d;
}

export default function JobInfo({ open, onOpenChange, job }: JobInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<Job>(job);
  const { setJobs } = useAuth();

  const appliedDate = safeDate(job.dateApplied);

  const handleUpdateRound = (round: string, state: string) => {
    setEditedJob((prev) => ({
      ...prev,
      roundStatus: {
        ...prev.roundStatus,
        [round]: state,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const updates: Partial<Job> = { jobId: job.id };
      const fieldsToSync: (keyof Job)[] = [
        "description",
        "review",
        "roundStatus",
      ];
      let hasChanges = false;
      fieldsToSync.forEach((field) => {
        const isObject = typeof editedJob[field] === "object";
        const changed = isObject
          ? JSON.stringify(editedJob[field]) !== JSON.stringify(job[field])
          : editedJob[field] !== job[field];
        if (changed) {
          updates[field] = editedJob[field];
          hasChanges = true;
        }
      });
      if (!hasChanges) {
        setIsEditing(false);
        return;
      }
      const response = await api.patch("/jobs", updates);
      if (response.status === 200) {
        const result = await response.data;
        setIsEditing(false);
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.id === result.job.id ? result.job : j)),
        );
        console.log("Update success:", result.job);
      } else {
        const err = await response.data;
        throw new Error(err.message || "Failed to save");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setEditedJob(job);
    }
    setIsEditing(!isEditing);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 max-h-[90vh] w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background p-6 shadow-lg focus:outline-none scrollbar-hide">
        <div className="flex items-center justify-between mb-2">
          <AlertDialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Briefcase className="h-6 w-6 text-primary" />
            Job Application Details
          </AlertDialogTitle>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleEdit}
            className={isEditing ? "text-destructive" : "text-muted-foreground"}
          >
            {isEditing ? (
              <X className="h-5 w-5" />
            ) : (
              <Pencil className="h-5 w-5" />
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {isEditing
            ? "Editing your application details..."
            : "View your saved job application and interview progress."}
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="Job Title" value={job.jobtitle} />
            <InfoBlock label="Company" value={job.company} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock
              label={
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Location
                </span>
              }
              value={job.location}
            />

            <InfoBlock
              label={
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Salary
                </span>
              }
              value={job.salary}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoBlock
              label="Employment Type"
              value={job.jobtype?.replace("-", " ")}
              capitalize
            />

            <InfoBlock
              label="Date Applied"
              value={appliedDate ? format(appliedDate, "PPP") : undefined}
              icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <Separator />

          <div>
            <p className="text-base font-medium mb-3">Interview Rounds</p>

            <div className="space-y-3">
              {editedJob.roundStatus &&
              Object.keys(editedJob.roundStatus).length > 0 ? (
                Object.keys(editedJob.roundStatus).map((round) => {
                  const state = editedJob.roundStatus?.[round] || "pending";

                  return (
                    <div
                      key={round}
                      className="flex items-center justify-between rounded-md border px-3 py-3 bg-muted/30 space-y-2"
                    >
                      <div className="font-medium text-sm">{round}</div>

                      <div className="flex items-center gap-6 text-sm">
                        <label
                          className={`flex items-center gap-2 ${isEditing ? "cursor-pointer" : "cursor-default opacity-70"}`}
                        >
                          <Checkbox
                            disabled={!isEditing}
                            checked={state === "passed"}
                            onCheckedChange={(checked) =>
                              handleUpdateRound(
                                round,
                                checked ? "passed" : "pending",
                              )
                            }
                          />
                          Passed
                        </label>

                        <label
                          className={`flex items-center gap-2 ${isEditing ? "cursor-pointer" : "cursor-default opacity-70"}`}
                        >
                          <Checkbox
                            disabled={!isEditing}
                            checked={state === "failed"}
                            onCheckedChange={(checked) =>
                              handleUpdateRound(
                                round,
                                checked ? "failed" : "pending",
                              )
                            }
                          />
                          Failed
                        </label>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No interview rounds added.
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Description / Job URL
            </p>
            {isEditing ? (
              <Textarea
                value={editedJob.description}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, description: e.target.value })
                }
                placeholder="Enter job description or URL..."
                className="min-h-25"
              />
            ) : (
              <InfoTextBlock value={job.description} />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Application Review & Notes
            </p>
            {isEditing ? (
              <Textarea
                value={editedJob.review}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, review: e.target.value })
                }
                placeholder="Add your notes here..."
                className="min-h-25"
              />
            ) : (
              <InfoTextBlock value={job.review} />
            )}
          </div>

          <div className="pt-4 flex gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1 gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <AlertDialogCancel asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </AlertDialogCancel>
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
