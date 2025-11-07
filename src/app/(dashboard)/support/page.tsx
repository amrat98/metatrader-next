"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { feedbackService, AddFeedbackRequest } from "@/lib/services/feedback.service";
import { UserContext } from "@/lib/usercontent";
import SupportTable from "./supporttable";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";

const FEEDBACK_TYPES = [
  "Trading Problem",
  "Account",
  "Money Flow Problem",
  "Bug Problem",
  "Suggestion",
  "API Binding Issue",
  "Report Violation",
  "Other",
];
const FLOW_TYPES = [
  "Withdraw",
  "Deposit",
  "Activated Fee",
  "Referral Bonus",
  "Fuel",
  "Team Rewards",
];
const ISSUE_TYPES = ["suggestion", "otherIssue"];

export default function Support() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { userToken } = useContext(UserContext) || {};

  const form = useForm<AddFeedbackRequest>({
    defaultValues: {
      feedbackType: "",
      description: "",
      screenshot: "",
      flowType: "",
      issueType: "",
    },
  });

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const onSubmit = async (data: AddFeedbackRequest) => {
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    try {
      if (!userToken) throw new Error("User not authenticated");
      let screenshotBase64 = data.screenshot;
      if (data.screenshot && typeof data.screenshot !== 'string') {
        // If screenshot is a File, convert to base64
        screenshotBase64 = await fileToBase64(data.screenshot as unknown as File);
      }
      await feedbackService.addFeedback(
        {
          ...data,
          screenshot: screenshotBase64 || "",
        },
        userToken
      );
      setSuccess("Ticket submitted successfully.");
      setShowSuccessDialog(true);
      form.reset();
    // } catch (e: any) {
    //   setError(e?.response?.data?.responseMessage || e.message || "Submission failed");
    } catch (error) {
      setError(error instanceof Error? error.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className="flex flex-1 flex-col gap-5 p-4">
        <div className="flex flex-1 flex-col gap-5 p-6 w-full mx-auto bg-card mt-6 rounded-xl border-2">
        <h2 className="text-primary text-lg md:text-xl lg:text-2xl font-semibold mb-3">
            New Ticket
        </h2>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap gap-5 w-full">
            <FormField
                control={form.control}
                name="feedbackType"
                rules={{ required: "Ticket type is required" }}
                render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Ticket Type</FormLabel>
                    <FormControl className="w-full">
                    <Select onValueChange={field.onChange} value={field.value} disabled={submitting}>
                        <SelectTrigger className="w-full min-h-12">
                        <SelectValue placeholder="Select ticket type" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                        {FEEDBACK_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="flowType"
                render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Flow Type (optional)</FormLabel>
                    <FormControl className="w-full">
                    <Select onValueChange={field.onChange} value={field.value} disabled={submitting}>
                        <SelectTrigger className="w-full min-h-12">
                        <SelectValue placeholder="Select flow type (if applicable)" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                        {FLOW_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="issueType"
                rules={{ required: "Issue type is required" }}
                render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Issue Type</FormLabel>
                    <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={submitting}>
                        <SelectTrigger className="w-full min-h-12">
                        <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                        {ISSUE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            <div className="flex flex-wrap gap-5 w-full">
            <FormField
                control={form.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl className="w-full min-h-12">
                    <Textarea {...field} placeholder="Describe your issue or suggestion" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="screenshot"
                render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Screenshot (optional)</FormLabel>
                    <FormControl>
                    <Input 
                        type="file"
                        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                        onChange={async (e) => {
                          const file = e.target.files?.[0] || null;
                          if (file) {
                            field.onChange(file);
                          } else {
                            field.onChange(undefined);
                          }
                        }}
                        disabled={submitting}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && (
                <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                    <DialogContent className="[&>button]:hidden" onPointerDownOutside={(event) => {event.preventDefault()}}>
                    <DialogTitle>Success</DialogTitle>
                    <DialogDescription>{success}</DialogDescription>
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={() => {setShowSuccessDialog(false); window.location.reload(); }} className="mt-4 w-full">OK</Button>
                    </DialogClose>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            <Button type="submit" disabled={submitting} className="w-full" size="xl">
                {submitting ? "Submitting..." : "Submit"}
            </Button>
            </form>
        </Form>
        </div>
        <div className="flex-1 pb-5">
          <SupportTable />
        </div>
    </div>
    </>
  );
}

