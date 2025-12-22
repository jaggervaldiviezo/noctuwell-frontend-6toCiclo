export interface ReviewDTO {
    id: number;
    comment: string;
    fecha: string;
    calificacion: number;
    patientId: number;
    specialistId: number;
}