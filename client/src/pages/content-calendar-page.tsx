import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ContentCalendarPage() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Calendar</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Scheduled Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {date ? (
                  `Content scheduled for ${date.toLocaleDateString()}`
                ) : (
                  "Select a date to view scheduled content"
                )}
              </p>
              <div className="rounded-md border p-4 text-center">
                <p className="text-muted-foreground">No content scheduled for this date</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Content for this Date
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}