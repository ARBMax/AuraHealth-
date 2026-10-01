import { Doctor } from '../types/aura';

export const initialDoctors: Doctor[] = [
  {
    id: "DOC-01",
    name: "Dr. Elena Rostova",
    title: "MD, FACS",
    specialty: "Trauma Surgery",
    status: "Available",
    activeLocation: "Trauma Bay 1 (ED Level 1)",
    pager: "PAGER #401",
    maxPatientLoad: 3,
    currentPatientIds: [],
    assignedInboundUnitId: undefined,
    experienceLevel: "Attending Physician",
    shiftHours: "07:00 - 19:00 (Day Trauma Lead)",
    contactExt: "x4101"
  },
  {
    id: "DOC-02",
    name: "Dr. Marcus Vance",
    title: "MD, FACEP",
    specialty: "Emergency Medicine",
    status: "Available",
    activeLocation: "Resuscitation Bay 2",
    pager: "PAGER #402",
    maxPatientLoad: 4,
    currentPatientIds: [],
    assignedInboundUnitId: undefined,
    experienceLevel: "Attending Physician",
    shiftHours: "06:00 - 18:00 (ED Resus Director)",
    contactExt: "x4102"
  },
  {
    id: "DOC-03",
    name: "Dr. Sarah Chen",
    title: "MD, FACC",
    specialty: "Interventional Cardiology",
    status: "Available",
    activeLocation: "Cardiac Cath Lab Suite 1",
    pager: "PAGER #403",
    maxPatientLoad: 2,
    currentPatientIds: [],
    assignedInboundUnitId: undefined,
    experienceLevel: "Attending Physician",
    shiftHours: "08:00 - 20:00 (Cath Lab Primary)",
    contactExt: "x4103"
  },
  {
    id: "DOC-04",
    name: "Dr. Tariq Al-Mansoor",
    title: "MD, FCCP",
    specialty: "Pulmonology / Infection Control",
    status: "Available",
    activeLocation: "Airborne Isolation Suite 201",
    pager: "PAGER #404",
    maxPatientLoad: 3,
    currentPatientIds: [],
    assignedInboundUnitId: undefined,
    experienceLevel: "Attending Physician",
    shiftHours: "07:00 - 19:00 (ICU / Isolation)",
    contactExt: "x4104"
  },
  {
    id: "DOC-05",
    name: "Dr. Julianne Mercer",
    title: "MD, PhD",
    specialty: "Hematology / Oncology",
    status: "Available",
    activeLocation: "Acute Hem-Onc Ward (Tower 4)",
    pager: "PAGER #405",
    maxPatientLoad: 4,
    currentPatientIds: [],
    assignedInboundUnitId: undefined,
    experienceLevel: "Senior Specialist",
    shiftHours: "08:00 - 18:00 (Hematopathology Lead)",
    contactExt: "x4105"
  },
  {
    id: "DOC-06",
    name: "Dr. Kenneth Reynolds",
    title: "MD, FAANS",
    specialty: "Neurosurgery",
    status: "Available",
    activeLocation: "Neuro OR Suite 4",
    pager: "PAGER #406",
    maxPatientLoad: 2,
    currentPatientIds: [],
    assignedInboundUnitId: undefined,
    experienceLevel: "Attending Physician",
    shiftHours: "On Call (Code Brain Specialist)",
    contactExt: "x4106"
  },
  {
    id: "DOC-07",
    name: "Dr. Priya Nair",
    title: "MD",
    specialty: "Critical Care Medicine",
    status: "Available",
    activeLocation: "Medical Intensive Care Unit (MICU)",
    pager: "PAGER #407",
    maxPatientLoad: 4,
    currentPatientIds: [],
    assignedInboundUnitId: undefined,
    experienceLevel: "Chief Fellow",
    shiftHours: "07:00 - 19:00 (MICU Floor Lead)",
    contactExt: "x4107"
  }
];

export const initialSpecializedEquipment = [
  {
    id: "EQ-01",
    name: "Belmont Rapid Blood Infuser",
    category: "Resuscitation" as const,
    currentLocation: "Trauma Bay 1",
    status: "Available & Staged" as const,
    assignedToPatientOrBay: undefined,
    batteryPercent: 100,
    lastSterilized: "Today 02:15"
  },
  {
    id: "EQ-02",
    name: "Hamilton-T1 ICU Transport Ventilator",
    category: "Ventilation" as const,
    currentLocation: "Resuscitation Bay 2",
    status: "Available & Staged" as const,
    assignedToPatientOrBay: undefined,
    batteryPercent: 96,
    lastSterilized: "Today 01:40"
  },
  {
    id: "EQ-03",
    name: "GlideScope Titanium Video Laryngoscope",
    category: "Resuscitation" as const,
    currentLocation: "Trauma Bay 1",
    status: "Available & Staged" as const,
    assignedToPatientOrBay: undefined,
    batteryPercent: 100,
    lastSterilized: "Today 03:30"
  },
  {
    id: "EQ-04",
    name: "Thoracostomy Chest Drainage Pleurovac (32 Fr)",
    category: "Surgical & Thoracic" as const,
    currentLocation: "Equipment Staging Core B",
    status: "Available & Staged" as const,
    assignedToPatientOrBay: undefined,
    batteryPercent: 100,
    lastSterilized: "Today 03:00"
  },
  {
    id: "EQ-05",
    name: "Optiflow High-Flow Nasal Cannula (60L/min)",
    category: "Ventilation" as const,
    currentLocation: "Negative-Pressure Suite 201 Ante-Room",
    status: "Available & Staged" as const,
    assignedToPatientOrBay: undefined,
    batteryPercent: 100,
    lastSterilized: "Today 02:45"
  },
  {
    id: "EQ-06",
    name: "PrisMax Continuous Renal Replacement (CRRT)",
    category: "Dialysis" as const,
    currentLocation: "ICU Central Pod",
    status: "Available & Staged" as const,
    assignedToPatientOrBay: undefined,
    batteryPercent: 100,
    lastSterilized: "Yesterday 18:00"
  },
  {
    id: "EQ-07",
    name: "Alaris Quad-Channel IV Infusion SmartPump",
    category: "Monitoring & Infusion" as const,
    currentLocation: "Acute Bay 4",
    status: "Available & Staged" as const,
    assignedToPatientOrBay: undefined,
    batteryPercent: 100,
    lastSterilized: "Today 00:30"
  }
];
