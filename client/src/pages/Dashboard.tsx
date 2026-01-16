import JobForm from "@/components/JobForm";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-[80vh] p-4 flex overflow-hidden">
      <div className="w-1/2 h-full bg-background p-6 flex flex-col">
        <div className="flex items-cneter justify-between gap-4 mb-8">
          <div className="flex flex-col">
            <div className="text-2xl flex flex-row font-bold p-0 gap-1">
              <div>Job</div> <div className="text-primary">Dashboard</div>
            </div>
            <div>
              Track your applications, interviews, and insights from one place.
            </div>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <PlusIcon className="h-4 w-4" />
            Add Application
          </Button>

          <JobForm open={open} onOpenChange={setOpen} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
