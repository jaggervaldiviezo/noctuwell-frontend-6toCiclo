export interface AppointmentDTO {
    id: number;
    date: string;
    time: string;
    reason: string;
    status: string;
    patientId: number;
    specialistId: number;
}