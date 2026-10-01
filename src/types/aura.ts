export type ActiveTab = 'command_center' | 'ambulances' | 'doctors' | 'resources' | 'triage' | 'specs';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: 'Trauma Surgery' | 'Emergency Medicine' | 'Critical Care Medicine' | 'Interventional Cardiology' | 'Hematology / Oncology' | 'Neurosurgery' | 'Pulmonology / Infection Control';
  status: 'Available' | 'Assigned / In Bay' | 'In Procedure / OR' | 'On Call';
  activeLocation: string;
  pager: string;
  maxPatientLoad: number;
  currentPatientIds: string[];
  assignedInboundUnitId?: string;
  experienceLevel: 'Attending Physician' | 'Chief Fellow' | 'Senior Specialist';
  shiftHours: string;
  contactExt: string;
}

export interface DiagnosticSample {
  id: string;
  name: string;
  category: 'hematology' | 'parasitology' | 'genomics';
  description: string;
  sampleType: string;
  stainMethod: string;
  cellCount: number;
  blastPercentage: number;
  primaryDiagnosis: string;
  severityLevel: 'low' | 'moderate' | 'high' | 'critical';
  confidenceScore: number;
  morphologyFindings: {
    feature: string;
    value: string;
    clinicalSignificance: string;
  }[];
  detectedCells: {
    id: string;
    label: string;
    x: number;
    y: number;
    w: number;
    h: number;
    confidence: number;
    type: 'blast' | 'lymphocyte' | 'neutrophil' | 'parasite' | 'erythrocyte';
  }[];
  geneExpression: {
    gene: string;
    log2FoldChange: number;
    zScore: number;
    pathway: string;
    mutationalStatus: 'Wild-Type' | 'Overexpressed' | 'Mutated / Fusion' | 'Downregulated';
  }[];
}

export interface PatientRecord {
  id: string;
  mrn: string;
  name?: string;
  age: number;
  gender: string;
  presentingComplaint: string;
  vitals: {
    hr: number;
    sbp: number;
    dbp: number;
    rr: number;
    spo2: number;
    temp: number;
    gcs: number;
  };
  news2Score: number;
  aiRiskScore: number;
  triageLevel: 1 | 2 | 3 | 4 | 5; // 1: Resuscitation, 2: Emergent, 3: Urgent, 4: Less Urgent, 5: Non-Urgent
  triageCategory: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  isolationRequired: boolean;
  isolationReason?: string;
  currentStage: 'Registration' | 'Triage' | 'Edge Diagnostics' | 'Physician Consult' | 'Bed Allocation' | 'Treatment / Discharge';
  stageEntryTime: string;
  waitDurationMins: number;
  assignedBed?: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  doctorSpecialtyNeeded?: string;
}

export interface BedUnit {
  id: string;
  ward: 'ICU' | 'Negative-Pressure Isolation' | 'Hematology / Oncology' | 'Emergency Step-Down' | 'General Ward';
  roomNumber: string;
  status: 'Occupied' | 'Available' | 'Cleaning' | 'Maintenance';
  patientId?: string;
  patientName?: string;
  airChangesPerHour?: number;
  ventilatorEquipped: boolean;
}

export interface BloodInventoryItem {
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  prbcUnits: number;
  plateletUnits: number;
  ffpUnits: number;
  cryoUnits: number;
  minThreshold: number;
  status: 'Adequate' | 'Caution' | 'Critical Shortage';
}

export interface SpecializedEquipment {
  id: string;
  name: string;
  category: 'Resuscitation' | 'Ventilation' | 'Surgical & Thoracic' | 'Monitoring & Infusion' | 'Dialysis';
  currentLocation: string;
  status: 'Available & Staged' | 'In Use' | 'Reserved for Inbound EMS' | 'Decontaminating';
  assignedToPatientOrBay?: string;
  batteryPercent: number;
  lastSterilized: string;
}

export interface AmbulanceDispatch {
  id: string;
  callSign: string;
  unitType: 'ALS (Advanced Life Support)' | 'BLS (Basic Life Support)' | 'Critical Care Transport' | 'Air MedEvac';
  status: 'Dispatched' | 'En Route to Scene' | 'On Scene' | 'Inbound to Hospital' | 'Arrived In-Bay' | 'Available';
  etaMins: number;
  priorityCode: 'Code 3 (Emergent/Lights & Sirens)' | 'Code 2 (Urgent)' | 'Code 1 (Routine)';
  incidentLocation: string;
  patientSummary: {
    age: number;
    gender: string;
    chiefComplaint: string;
    notes: string;
  };
  requiredResources: {
    destinationBay: 'Trauma Bay 1' | 'Resuscitation Bay 2' | 'Negative-Pressure Suite 201' | 'Cardiac Cath Lab' | 'Acute Bay 4';
    medicalEquipment: string[];
    bloodProducts: {
      product: string;
      quantity: number;
      status: 'Pre-Warmed in Bay' | 'Thawing in Blood Bank' | 'En Route with Courier' | 'Standby Refrigerator';
    }[];
    hospitalTeamActivation: string;
    bedAssignedId: string;
    assignedDoctorName?: string;
    assignedDoctorId?: string;
  };
  crewNotes: string;
  acknowledgedByED: boolean;
}
