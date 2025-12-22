export interface DiagnosisDTO {
    id: number;
    description: string;
    type: string;
    recommendations: string;
    date: string; 
    appointmentId: number;
    historyId: number;
    specialistId: number;
    patientId:number;
}