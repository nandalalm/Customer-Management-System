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

function getRaw10Digits(phoneValue?: string): string {
  if (!phoneValue) return "";
  let cleaned = phoneValue.trim();
  if (cleaned.startsWith("+91")) {
    cleaned = cleaned.slice(3).trim();
  } else if (cleaned.startsWith("91") && cleaned.length > 10) {
    cleaned = cleaned.slice(2).trim();
  }
  return cleaned.replace(/\D/g, "").slice(0, 10);
}

function formatInitialPhone(phone?: string): string {
  if (!phone) return "";
  const digits = getRaw10Digits(phone);
  return digits ? `+91 ${digits}` : "";
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
    mode: "onChange",
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: formatInitialPhone(customer?.phone),
      company: customer?.company ?? "",
      status: (customer?.status ?? "") as unknown as "active" | "inactive",
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
      phone: formatInitialPhone(customer?.phone),
      company: customer?.company ?? "",
      status: (customer?.status ?? "") as unknown as "active" | "inactive",
      notes: customer?.notes ?? "",
      lastContactDate: customer?.lastContactDate
        ? customer.lastContactDate.split("T")[0]
        : "",
    });
  }, [customer, form]);

  function onSubmit(values: CustomerSchema): void {
    const payload = {
      ...values,
      notes: values.notes ? values.notes.trim() : "",
      lastContactDate: new Date(values.lastContactDate).toISOString(),
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
            render={({ field }) => {
              // Extract raw 10 digits to render inside input
              const rawDigits = getRaw10Digits(field.value);

              return (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <span className="inline-flex h-9 items-center rounded-l-md border border-r-0 border-border bg-muted/60 px-3 text-xs font-medium text-muted-foreground select-none shrink-0">
                        🇮🇳 +91
                      </span>
                      <Input
                        id="customer-form-phone"
                        type="text"
                        inputMode="numeric"
                        placeholder="9876543210"
                        maxLength={10}
                        value={rawDigits}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                          field.onChange(digitsOnly ? `+91 ${digitsOnly}` : "");
                        }}
                        className="h-9 rounded-l-none text-xs border-border bg-card/60"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
