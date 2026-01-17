import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { format } from "date-fns";
import { Briefcase, MapPin, CalendarIcon, DollarSign } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import RoundStatusEditor from "@/components/RoundStatusEditor";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import type { JobFormProps } from "@/lib/props";

const jobformSchema = z.object({
  jobtitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  jobtype: z.string().min(1, "Select a job type"),
  salary: z.string().optional(),
  description: z.string().optional(),
  dateApplied: z.date(),
  review: z.string().optional(),
  roundStatus: z.record(z.string(), z.string()),
});

export default function JobForm({ open, onOpenChange }: JobFormProps) {
  const form = useForm<z.infer<typeof jobformSchema>>({
    resolver: zodResolver(jobformSchema),
    defaultValues: {
      jobtitle: "",
      company: "",
      location: "",
      jobtype: "",
      salary: "",
      description: "",
      dateApplied: new Date(),
      review: "",
      roundStatus: {},
    },
  });

  const [dateOpen, setDateOpen] = useState(false);
  const { user, setJobs } = useAuth();

  const handleSubmit = async (values: z.infer<typeof jobformSchema>) => {
    try {
      const userId = user?.id;
      const payload = { ...values, userId };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs`,
        payload,
        {
          withCredentials: true,
        }
      );
      console.log("API Response:", res.data);
      if (res.status === 201) {
        toast.success("Job application added successfully!");
        setJobs((prevJobs) => [...prevJobs, res.data.job]);
        form.reset();
        onOpenChange(false);
        return;
      }
    } catch (error) {
      console.error("Error submitting job application:", error);
      toast.error("Failed to add job application. Please try again.");
      return;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <AlertDialogTitle className="flex items-center gap-2 text-2xl font-bold mb-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Add Job Application
        </AlertDialogTitle>

        <AlertDialogDescription className="text-sm text-muted-foreground mb-6">
          Keep track of your interview progress and application details.
        </AlertDialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Senior Frontend Developer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech Solutions Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="London, UK (Remote)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" />
                      Salary
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. £80,000" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <FormField
                control={form.control}
                name="jobtype"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Employment Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {[
                          ["full-time", "Full Time"],
                          ["part-time", "Part Time"],
                          ["internship", "Internship"],
                        ].map(([value, label]) => (
                          <div
                            key={value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={value} id={value} />
                            <Label
                              htmlFor={value}
                              className="font-normal cursor-pointer"
                            >
                              {label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateApplied"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Date Applied</FormLabel>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-48 justify-between font-normal"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Select date"}
                          <CalendarIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="roundStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Interview Rounds</FormLabel>
                  <FormControl>
                    <RoundStatusEditor field={field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description / Job URL</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-20" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Review & Notes</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-24" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button type="submit" className="w-full">
                Save Application
              </Button>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </AlertDialogCancel>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
