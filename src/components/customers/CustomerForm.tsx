"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { customerSchema, type CustomerSchema } from "@/schemas/customer.schema";
import { useCreateCustomer } from "@/hooks/useCreateCustomer";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";
import type { Customer } from "@/types";

interface CustomerFormProps {
  customer?: Customer;
  onSuccess: () => void;
}

export function CustomerForm({
  customer,
  onSuccess,
}: CustomerFormProps): React.JSX.Element {
  const isEdit = customer !== undefined;

  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const isPending = isCreating || isUpdating;

  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      company: customer?.company ?? "",
      status: customer?.status ?? "active",
      notes: customer?.notes ?? "",
      lastContactDate: customer?.lastContactDate
        ? customer.lastContactDate.split("T")[0]
        : "",
    },
  });

  // Reset form values when switching between customers (e.g. editing different rows)
  useEffect(() => {
    form.reset({
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      company: customer?.company ?? "",
      status: customer?.status ?? "active",
      notes: customer?.notes ?? "",
      lastContactDate: customer?.lastContactDate
        ? customer.lastContactDate.split("T")[0]
        : "",
    });
  }, [customer, form]);

  function onSubmit(values: CustomerSchema): void {
    const payload = {
      ...values,
      // Store date as ISO string if provided; keep optional field absent if empty
      lastContactDate: values.lastContactDate
        ? new Date(values.lastContactDate).toISOString()
        : undefined,
    };

    if (isEdit) {
      updateCustomer(
        { id: customer.id, data: payload },
        { onSuccess }
      );
    } else {
      createCustomer(payload, { onSuccess });
    }
  }

  return (
    <Form {...form}>
      <form
        id="customer-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  id="customer-form-name"
                  placeholder="Jane Smith"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  id="customer-form-email"
                  type="email"
                  placeholder="jane@company.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone + Company side by side */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    id="customer-form-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
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
                  <Input
                    id="customer-form-company"
                    placeholder="Acme Corp"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status + Last Contact side by side */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger
                      id="customer-form-status"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastContactDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Contact Date</FormLabel>
                <FormControl>
                  <Input
                    id="customer-form-last-contact"
                    type="date"
                    {...field}
                    value={field.value ?? ""}
                    className="[color-scheme:dark] dark:[color-scheme:dark]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  id="customer-form-notes"
                  placeholder="Any relevant details about this customer…"
                  rows={3}
                  className="resize-y"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button
            id="customer-form-submit"
            type="submit"
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="size-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
