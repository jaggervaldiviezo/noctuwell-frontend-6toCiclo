import { SpecialistDTO } from "./specialistDTO";

export interface Appointment {
    id: number;
    date: string;
    time: string;
    reason: string;
    status: string;
    specialist: SpecialistDTO; 
    patient: any;
}