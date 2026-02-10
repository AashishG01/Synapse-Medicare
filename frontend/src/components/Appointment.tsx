
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";

interface Appointment {
  patientName: string;
  phone: string;
  doctorId: string; // Changed to ID
  date: Date;
  time: string;
  type: string;
  notes?: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

export default function AppointmentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    type: "checkup",
  });

  // Fetch doctors from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Failed to load doctors:", err));
  }, []);

  const handleCreateAppointment = async () => {
    const { patientName, phone, doctorId, time } = newAppointment;

    if (patientName && phone && doctorId && date && time) {
      const appointmentData = {
        patientName,
        phone,
        doctorId,
        date: date.toISOString(),
        time,
        notes: newAppointment.notes || "",
        type: "checkup",
      };

      try {
        const response = await fetch("http://localhost:5000/api/v1/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${localStorage.getItem('token')}` // Add if using auth
          },
          body: JSON.stringify(appointmentData)
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Appointment saved:", data);
          alert("Appointment successfully scheduled!");
          setIsOpen(false);
          setNewAppointment({ type: "checkup" });
          setDate(undefined);
        } else {
          alert(`Error: ${data.message || "Failed to schedule"}`);
        }

      } catch (error) {
        console.error("Error saving appointment:", error);
        alert("Error scheduling appointment. Please try again.");
      }
    } else {
      alert("Please fill in all the required fields.");
    }
  };

  return (
    <>
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Book Appointment
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the appointment details below to schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder="Patient Name"
              value={newAppointment.patientName || ""}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, patientName: e.target.value })
              }
            />

            <Input
              type="tel"
              placeholder="Phone Number"
              value={newAppointment.phone || ""}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, phone: e.target.value })
              }
            />

            <Select
              value={newAppointment.doctorId}
              onValueChange={(value) =>
                setNewAppointment({ ...newAppointment, doctorId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={!date ? "text-muted-foreground" : ""}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={newAppointment.time}
                onValueChange={(value) =>
                  setNewAppointment({ ...newAppointment, time: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Notes (Optional)"
              value={newAppointment.notes || ""}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, notes: e.target.value })
              }
            />

            <Button onClick={handleCreateAppointment} className="w-full">
              Schedule Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
