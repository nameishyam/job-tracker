import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Briefcase, IndianRupee } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import type { ReviewFormProps } from "@/lib/props";
import NewRounds from "./NewRounds";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const reviewFormSchema = z.object({
  company: z.string().min(1, "Company is required"),
  review: z.string().min(1, "Review cannot be empty"),
  rating: z.float64().min(0.0).max(5.0),
  salary: z.string().min(0, "Salary cannot be empty"),
  rounds: z.array(z.string()),
  role: z.string().min(1, "Role is required"),
});

export default function ReviewForm({ open, onOpenChange }: ReviewFormProps) {
  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      company: "",
      review: "",
      rating: 0.0,
      salary: "",
      rounds: [],
      role: "",
    },
  });

  const { user, setReviews } = useAuth();

  const handleSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    try {
      const userId = user?.id;
      const payload = { ...values, userId };
      const response = await api.post("/reviews", payload);
      if (response.status === 201) {
        setReviews((prevreviews) => [response.data.blog, ...prevreviews]);
        toast.success("Review submitted successfully!");
        form.reset();
        return;
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <AlertDialogTitle className="flex items-center gap-2 text-2xl font-bold mb-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Add Company Review
        </AlertDialogTitle>

        <AlertDialogDescription className="text-sm text-muted-foreground mb-6">
          Share your experience and feedback about the role and interview
          process.
        </AlertDialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Engineering Intern / SDE I"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <IndianRupee className="h-3.5 w-3.5" />
                      Salary
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ₹10 LPA" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0 - 5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        min={0}
                        max={5}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rounds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Rounds</FormLabel>
                  <FormControl>
                    <NewRounds field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-28"
                      placeholder="Share your experience, interview difficulty, culture, etc."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button type="submit" className="w-full">
                Save Review
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
