import { format } from "date-fns";
import { Briefcase, MapPin, DollarSign, CalendarIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import type { JobInfoProps } from "@/lib/props";
import { useState } from "react";
import InfoBlock from "./InfoBlock";
import InfoTextBlock from "./InfoTextBlock";

function safeDate(value?: Date | string) {
  if (!value) return null;
  const d = typeof value === "string" ? new Date(value) : value;
  return isNaN(d.getTime()) ? null : d;
}

export default function JobInfo({ open, onOpenChange, job }: JobInfoProps) {
  const appliedDate = safeDate(job.dateApplied);

  const [roundStates, setRoundStates] = useState<Record<string, string>>(
    job.roundStatus || {}
  );

  function updateRound(round: string, state: string) {
    setRoundStates((prev) => ({
      ...prev,
      [round]: state,
    }));
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 max-h-[90vh] w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background p-6 shadow-lg focus:outline-none scrollbar-hide">
        <AlertDialogTitle className="flex items-center gap-2 text-2xl font-bold mb-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Job Application Details
        </AlertDialogTitle>

        <p className="text-sm text-muted-foreground mb-6">
          View your saved job application and interview progress.
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
                  <DollarSign className="h-3.5 w-3.5" />
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
              {job.roundStatus && Object.keys(job.roundStatus).length > 0 ? (
                Object.keys(job.roundStatus).map((round) => {
                  const state = roundStates[round] || "pending";

                  return (
                    <div
                      key={round}
                      className="flex items-center justify-between rounded-md border px-3 py-3 bg-muted/30 space-y-2"
                    >
                      <div className="font-medium text-sm">{round}</div>

                      <div className="flex items-center gap-6 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={state === "passed"}
                            onCheckedChange={(checked) =>
                              updateRound(round, checked ? "passed" : "pending")
                            }
                          />
                          Passed
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={state === "failed"}
                            onCheckedChange={(checked) =>
                              updateRound(round, checked ? "failed" : "pending")
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

          <InfoTextBlock
            label="Description / Job URL"
            value={job.description}
          />

          <InfoTextBlock
            label="Application Review & Notes"
            value={job.review}
          />

          <div className="pt-4">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </AlertDialogCancel>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
