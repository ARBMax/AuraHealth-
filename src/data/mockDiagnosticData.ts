import { DiagnosticSample, PatientRecord, BedUnit, BloodInventoryItem } from '../types/aura';

export const mockDiagnosticSamples: DiagnosticSample[] = [
  {
    id: "SAMP-ALL-01",
    name: "Acute Lymphoblastic Leukemia (B-ALL)",
    category: "hematology",
    description: "Peripheral blood smear displaying prominent proliferation of immature monomorphic lymphoblasts with high nuclear-cytoplasmic ratio and condensed chromatin.",
    sampleType: "Peripheral Blood Smear (Wright-Giemsa 100x)",
    stainMethod: "Wright-Giemsa automated deconvolution",
    cellCount: 48,
    blastPercentage: 38.5,
    primaryDiagnosis: "B-Cell Acute Lymphoblastic Leukemia (High Risk)",
    severityLevel: "critical",
    confidenceScore: 0.968,
    morphologyFindings: [
      { feature: "Nuclear-to-Cytoplasmic (N:C) Ratio", value: "0.88 (Markedly Elevated)", clinicalSignificance: "Pathognomonic for blast lineage" },
      { feature: "Chromatin Pattern", value: "Fine, dispersed with inconspicuous nucleoli", clinicalSignificance: "Indicates undifferentiated precursor cell" },
      { feature: "Auer Rods", value: "Negative", clinicalSignificance: "Rules out acute myeloid M3 subtype" },
      { feature: "Platelet Estimate", value: "Markedly Decreased (< 18,000/μL)", clinicalSignificance: "High hemorrhage risk; urgent apheresis platelets required" }
    ],
    detectedCells: [
      { id: "c1", label: "Lymphoblast (Malignant)", x: 80, y: 70, w: 90, h: 90, confidence: 0.98, type: "blast" },
      { id: "c2", label: "Lymphoblast (Malignant)", x: 210, y: 130, w: 95, h: 95, confidence: 0.97, type: "blast" },
      { id: "c3", label: "Lymphoblast (Malignant)", x: 340, y: 80, w: 85, h: 85, confidence: 0.95, type: "blast" },
      { id: "c4", label: "Lymphoblast (Malignant)", x: 140, y: 220, w: 92, h: 92, confidence: 0.96, type: "blast" },
      { id: "c5", label: "Lymphoblast (Malignant)", x: 290, y: 240, w: 88, h: 88, confidence: 0.94, type: "blast" },
      { id: "c6", label: "Erythrocyte (Normocytic)", x: 40, y: 180, w: 50, h: 50, confidence: 0.99, type: "erythrocyte" },
      { id: "c7", label: "Erythrocyte (Normocytic)", x: 450, y: 150, w: 52, h: 52, confidence: 0.98, type: "erythrocyte" },
      { id: "c8", label: "Segmented Neutrophil", x: 420, y: 260, w: 80, h: 80, confidence: 0.93, type: "neutrophil" }
    ],
    geneExpression: [
      { gene: "BCR-ABL1 (t(9;22))", log2FoldChange: 4.82, zScore: 3.45, pathway: "Tyrosine Kinase Activation", mutationalStatus: "Mutated / Fusion" },
      { gene: "IKZF1 (Ikaros)", log2FoldChange: -2.91, zScore: -2.64, pathway: "Lymphoid Lineage Differentiation", mutationalStatus: "Downregulated" },
      { gene: "CD19 Expression", log2FoldChange: 3.65, zScore: 2.88, pathway: "B-Cell Surface Marker", mutationalStatus: "Overexpressed" },
      { gene: "TP53 (Tumor Suppressor)", log2FoldChange: -1.84, zScore: -1.95, pathway: "DNA Damage / Apoptosis", mutationalStatus: "Downregulated" },
      { gene: "FLT3 (Tyrosine Kinase)", log2FoldChange: 2.15, zScore: 1.82, pathway: "Hematopoietic Stem Proliferation", mutationalStatus: "Overexpressed" },
      { gene: "PML-RARA (t(15;17))", log2FoldChange: 0.05, zScore: 0.08, pathway: "Retinoic Acid Receptor", mutationalStatus: "Wild-Type" }
    ]
  },
  {
    id: "SAMP-MAL-02",
    name: "Plasmodium falciparum (Severe Malaria)",
    category: "parasitology",
    description: "Giemsa-stained thin blood smear exhibiting heavy parasitemia (> 4.5%) with distinctive delicate intracellular ring-form trophozoites and multiple chromatin dots.",
    sampleType: "Giemsa-Stained Thin Smear (100x Oil)",
    stainMethod: "Giemsa 10% deconvolution",
    cellCount: 65,
    blastPercentage: 0.0,
    primaryDiagnosis: "Severe Plasmodium falciparum Malaria",
    severityLevel: "critical",
    confidenceScore: 0.982,
    morphologyFindings: [
      { feature: "Parasitemia Density", value: "4.8% Infected Erythrocytes", clinicalSignificance: "Exceeds WHO severe malaria threshold (> 2%)" },
      { feature: "Trophozoite Morphology", value: "Fine ring stages with double chromatin dots", clinicalSignificance: "Diagnostic for P. falciparum over P. vivax" },
      { feature: "Schizonts / Gametocytes", value: "Absent in peripheral stream", clinicalSignificance: "Sequestration in microvasculature indicates cerebral risk" },
      { feature: "Hemoglobin Estimate", value: "6.8 g/dL (Severe Hemolytic Anemia)", clinicalSignificance: "Urgent Packed Red Blood Cell transfusion indicated" }
    ],
    detectedCells: [
      { id: "m1", label: "P. falciparum Ring Form", x: 120, y: 90, w: 45, h: 45, confidence: 0.99, type: "parasite" },
      { id: "m2", label: "P. falciparum Ring Form", x: 260, y: 110, w: 45, h: 45, confidence: 0.98, type: "parasite" },
      { id: "m3", label: "P. falciparum Double Dot", x: 180, y: 220, w: 48, h: 48, confidence: 0.97, type: "parasite" },
      { id: "m4", label: "P. falciparum Ring Form", x: 380, y: 190, w: 46, h: 46, confidence: 0.98, type: "parasite" },
      { id: "m5", label: "Uninfected Erythrocyte", x: 50, y: 150, w: 52, h: 52, confidence: 0.99, type: "erythrocyte" },
      { id: "m6", label: "Uninfected Erythrocyte", x: 320, y: 70, w: 54, h: 54, confidence: 0.99, type: "erythrocyte" },
      { id: "m7", label: "Monocyte with Hemozoin", x: 240, y: 280, w: 75, h: 75, confidence: 0.92, type: "lymphocyte" }
    ],
    geneExpression: [
      { gene: "PfHRP2 (Parasite Antigen)", log2FoldChange: 5.42, zScore: 4.10, pathway: "Histidine-Rich Protein II", mutationalStatus: "Overexpressed" },
      { gene: "TNF-Alpha (Host Response)", log2FoldChange: 3.90, zScore: 3.12, pathway: "Pro-inflammatory Cascade", mutationalStatus: "Overexpressed" },
      { gene: "Interleukin-6 (IL-6)", log2FoldChange: 3.40, zScore: 2.75, pathway: "Acute Phase Reaction", mutationalStatus: "Overexpressed" },
      { gene: "EPO (Erythropoietin)", log2FoldChange: 2.80, zScore: 2.21, pathway: "Erythropoiesis Stimulus", mutationalStatus: "Overexpressed" },
      { gene: "HBB (Beta-Globin)", log2FoldChange: -2.10, zScore: -1.85, pathway: "Hemoglobin Synthesis", mutationalStatus: "Downregulated" }
    ]
  },
  {
    id: "SAMP-AML-03",
    name: "Acute Promyelocytic Leukemia (APL / AML-M3)",
    category: "hematology",
    description: "Marked hypergranular promyelocytes packed with multiple Auer rods (faggot cells) characteristic of PML-RARA promyelocytic leukemia.",
    sampleType: "Bone Marrow Aspirate & Peripheral Smear",
    stainMethod: "Wright-Giemsa + Myeloperoxidase (MPO)",
    cellCount: 42,
    blastPercentage: 45.2,
    primaryDiagnosis: "Acute Promyelocytic Leukemia (PML-RARA)",
    severityLevel: "critical",
    confidenceScore: 0.974,
    morphologyFindings: [
      { feature: "Promyelocyte Morphology", value: "Dense azurophilic granules, folded reniform nuclei", clinicalSignificance: "APL subtype diagnostic" },
      { feature: "Auer Rods (Faggot Cells)", value: "Present (Multiple stacked crystalline needles)", clinicalSignificance: "High likelihood of severe coagulopathy / DIC" },
      { feature: "Coagulation Risk", value: "Fibrinogen < 100 mg/dL, D-Dimer > 20 μg/mL", clinicalSignificance: "Life-threatening hemorrhagic diathesis; initiate ATRA + Cryo" }
    ],
    detectedCells: [
      { id: "aml1", label: "Atypical Promyelocyte", x: 110, y: 80, w: 96, h: 96, confidence: 0.98, type: "blast" },
      { id: "aml2", label: "Faggot Cell (Auer Bundle)", x: 260, y: 120, w: 105, h: 105, confidence: 0.99, type: "blast" },
      { id: "aml3", label: "Atypical Promyelocyte", x: 190, y: 230, w: 94, h: 94, confidence: 0.96, type: "blast" },
      { id: "aml4", label: "Platelet (Scattered Debris)", x: 380, y: 220, w: 30, h: 30, confidence: 0.88, type: "erythrocyte" }
    ],
    geneExpression: [
      { gene: "PML-RARA (t(15;17))", log2FoldChange: 6.12, zScore: 4.88, pathway: "Promyelocyte Differentiation Block", mutationalStatus: "Mutated / Fusion" },
      { gene: "MPO (Myeloperoxidase)", log2FoldChange: 4.15, zScore: 3.32, pathway: "Myeloid Granule Content", mutationalStatus: "Overexpressed" },
      { gene: "FLT3-ITD", log2FoldChange: 2.70, zScore: 2.15, pathway: "Kinase Proliferation", mutationalStatus: "Mutated / Fusion" },
      { gene: "TF (Tissue Factor / F3)", log2FoldChange: 3.85, zScore: 3.05, pathway: "Pro-coagulant Trigger (DIC)", mutationalStatus: "Overexpressed" }
    ]
  },
  {
    id: "SAMP-LEUK-04",
    name: "Severe Reactive Leukocytosis (Bacterial Sepsis)",
    category: "hematology",
    description: "Marked leukocytosis with neutrophilic left shift, toxic granulation, and Döhle bodies in the cytoplasm of band and segmented neutrophils.",
    sampleType: "Peripheral Blood Smear",
    stainMethod: "Wright-Giemsa",
    cellCount: 52,
    blastPercentage: 1.2,
    primaryDiagnosis: "Severe Leukemoid Reaction secondary to Sepsis",
    severityLevel: "high",
    confidenceScore: 0.951,
    morphologyFindings: [
      { feature: "Band & Neutrophil Count", value: "82% Differential (Severe Left Shift)", clinicalSignificance: "Reactive bacterial infection vs chronic myeloid leukemia" },
      { feature: "Cytoplasmic Inclusions", value: "Prominent Toxic Granulation & Döhle Bodies", clinicalSignificance: "Excludes acute blast crisis; indicates systemic septic state" },
      { feature: "Blast Threshold", value: "1.2% (Below acute leukemia cutoff 20%)", clinicalSignificance: "Non-malignant reactive etiology" }
    ],
    detectedCells: [
      { id: "n1", label: "Band Neutrophil (Toxic)", x: 90, y: 110, w: 84, h: 84, confidence: 0.95, type: "neutrophil" },
      { id: "n2", label: "Segmented Neutrophil", x: 240, y: 90, w: 80, h: 80, confidence: 0.97, type: "neutrophil" },
      { id: "n3", label: "Metamyelocyte", x: 180, y: 220, w: 88, h: 88, confidence: 0.93, type: "neutrophil" },
      { id: "n4", label: "Lymphocyte", x: 350, y: 160, w: 65, h: 65, confidence: 0.98, type: "lymphocyte" }
    ],
    geneExpression: [
      { gene: "PROC (Protein C)", log2FoldChange: -2.40, zScore: -2.10, pathway: "Anticoagulation", mutationalStatus: "Downregulated" },
      { gene: "S100A8 / S100A9 (Calprotectin)", log2FoldChange: 4.80, zScore: 3.75, pathway: "Neutrophil Activation", mutationalStatus: "Overexpressed" },
      { gene: "IL-1B (Interleukin 1 Beta)", log2FoldChange: 3.70, zScore: 2.95, pathway: "Febrile Inflammatory Response", mutationalStatus: "Overexpressed" },
      { gene: "BCR-ABL1", log2FoldChange: -0.05, zScore: -0.02, pathway: "CML Marker", mutationalStatus: "Wild-Type" }
    ]
  },
  {
    id: "SAMP-NORM-05",
    name: "Normal Peripheral Blood Cytology",
    category: "hematology",
    description: "Normocytic, normochromic erythrocytes with appropriate central pallor, normal platelet clumps, and mature segmented neutrophils and lymphocytes.",
    sampleType: "Peripheral Blood Smear",
    stainMethod: "Wright-Giemsa",
    cellCount: 50,
    blastPercentage: 0.0,
    primaryDiagnosis: "Normal Hematologic Baseline",
    severityLevel: "low",
    confidenceScore: 0.991,
    morphologyFindings: [
      { feature: "Erythrocyte Morphology", value: "Normocytic, normochromic, uniform diameter (~7.2 μm)", clinicalSignificance: "No anisocytosis or poikilocytosis" },
      { feature: "Platelet Distribution", value: "10-15 per oil immersion field (Adequate)", clinicalSignificance: "Normal hemostatic competence" },
      { feature: "WBC Differential", value: "Neutrophils 62%, Lymphocytes 30%, Monocytes 6%", clinicalSignificance: "Healthy physiologic distribution" }
    ],
    detectedCells: [
      { id: "nor1", label: "Erythrocyte", x: 80, y: 90, w: 52, h: 52, confidence: 0.99, type: "erythrocyte" },
      { id: "nor2", label: "Segmented Neutrophil", x: 220, y: 120, w: 78, h: 78, confidence: 0.98, type: "neutrophil" },
      { id: "nor3", label: "Small Lymphocyte", x: 360, y: 140, w: 62, h: 62, confidence: 0.99, type: "lymphocyte" }
    ],
    geneExpression: [
      { gene: "BCR-ABL1", log2FoldChange: 0.00, zScore: 0.00, pathway: "Leukemia Panel", mutationalStatus: "Wild-Type" },
      { gene: "TP53", log2FoldChange: 0.12, zScore: 0.09, pathway: "Tumor Suppressor", mutationalStatus: "Wild-Type" },
      { gene: "FLT3", log2FoldChange: -0.08, zScore: -0.05, pathway: "Tyrosine Kinase", mutationalStatus: "Wild-Type" }
    ]
  }
];

export const initialPatients: PatientRecord[] = [
  {
    id: "PAT-101",
    mrn: "MRN-892401",
    age: 19,
    gender: "Female",
    presentingComplaint: "Acute petechial rash, severe fatigue, bleeding gums, high fever",
    vitals: { hr: 124, sbp: 92, dbp: 58, rr: 26, spo2: 94, temp: 39.2, gcs: 14 },
    news2Score: 8,
    aiRiskScore: 0.94,
    triageLevel: 1,
    triageCategory: "Level 1: Resuscitation (Blast Crisis)",
    bloodType: "A+",
    isolationRequired: true,
    isolationReason: "Severe Neutropenic Anergy / Blast Proliferation",
    currentStage: "Edge Diagnostics",
    stageEntryTime: "02:40",
    waitDurationMins: 14,
    assignedBed: "ICU-02"
  },
  {
    id: "PAT-102",
    mrn: "MRN-671239",
    age: 34,
    gender: "Male",
    presentingComplaint: "Recurrent cyclical fever, chills, confusion following tropical travel",
    vitals: { hr: 118, sbp: 104, dbp: 66, rr: 22, spo2: 95, temp: 40.1, gcs: 13 },
    news2Score: 7,
    aiRiskScore: 0.91,
    triageLevel: 2,
    triageCategory: "Level 2: Emergent (Severe Malaria)",
    bloodType: "O-",
    isolationRequired: true,
    isolationReason: "High Parasitemia / Vector Precautions",
    currentStage: "Physician Consult",
    stageEntryTime: "02:22",
    waitDurationMins: 32,
    assignedBed: "ISO-01"
  },
  {
    id: "PAT-103",
    mrn: "MRN-449102",
    age: 58,
    gender: "Male",
    presentingComplaint: "Productive cough, chest pain, rigors, hypotension",
    vitals: { hr: 108, sbp: 96, dbp: 60, rr: 24, spo2: 92, temp: 38.8, gcs: 15 },
    news2Score: 6,
    aiRiskScore: 0.72,
    triageLevel: 2,
    triageCategory: "Level 2: Emergent (Sepsis)",
    bloodType: "B+",
    isolationRequired: false,
    currentStage: "Bed Allocation",
    stageEntryTime: "02:10",
    waitDurationMins: 44,
    assignedBed: "STEP-01"
  },
  {
    id: "PAT-104",
    mrn: "MRN-331098",
    age: 27,
    gender: "Female",
    presentingComplaint: "Mild throat irritation, low grade fever, malaise",
    vitals: { hr: 78, sbp: 118, dbp: 74, rr: 16, spo2: 99, temp: 37.3, gcs: 15 },
    news2Score: 0,
    aiRiskScore: 0.08,
    triageLevel: 5,
    triageCategory: "Level 5: Non-Urgent (Viral URI)",
    bloodType: "O+",
    isolationRequired: false,
    currentStage: "Treatment / Discharge",
    stageEntryTime: "02:35",
    waitDurationMins: 18
  },
  {
    id: "PAT-105",
    mrn: "MRN-552914",
    age: 44,
    gender: "Female",
    presentingComplaint: "Severe epistaxis, spontaneous bruising, gum bleeding",
    vitals: { hr: 112, sbp: 100, dbp: 62, rr: 20, spo2: 96, temp: 38.1, gcs: 15 },
    news2Score: 5,
    aiRiskScore: 0.89,
    triageLevel: 2,
    triageCategory: "Level 2: Emergent (Coagulopathy / APL)",
    bloodType: "AB+",
    isolationRequired: true,
    isolationReason: "Profound Thrombocytopenia & Leukopenia",
    currentStage: "Triage",
    stageEntryTime: "02:48",
    waitDurationMins: 6
  }
];

export const initialBeds: BedUnit[] = [
  { id: "ICU-01", ward: "ICU", roomNumber: "ICU-101", status: "Occupied", patientId: "PAT-PREV-1", patientName: "J. Miller (Septic Shock)", ventilatorEquipped: true },
  { id: "ICU-02", ward: "ICU", roomNumber: "ICU-102", status: "Occupied", patientId: "PAT-101", patientName: "A. Patel (B-ALL Blast Crisis)", ventilatorEquipped: true },
  { id: "ICU-03", ward: "ICU", roomNumber: "ICU-103", status: "Available", ventilatorEquipped: true },
  { id: "ICU-04", ward: "ICU", roomNumber: "ICU-104", status: "Cleaning", ventilatorEquipped: true },
  
  { id: "ISO-01", ward: "Negative-Pressure Isolation", roomNumber: "ISO-201", status: "Occupied", patientId: "PAT-102", patientName: "D. Vance (P. falciparum)", airChangesPerHour: 14.2, ventilatorEquipped: true },
  { id: "ISO-02", ward: "Negative-Pressure Isolation", roomNumber: "ISO-202", status: "Available", airChangesPerHour: 13.8, ventilatorEquipped: true },
  { id: "ISO-03", ward: "Negative-Pressure Isolation", roomNumber: "ISO-203", status: "Maintenance", airChangesPerHour: 12.0, ventilatorEquipped: false },
  
  { id: "HEM-01", ward: "Hematology / Oncology", roomNumber: "HEM-301", status: "Occupied", patientId: "PAT-PREV-2", patientName: "M. Torres (AML M4)", ventilatorEquipped: false },
  { id: "HEM-02", ward: "Hematology / Oncology", roomNumber: "HEM-302", status: "Available", ventilatorEquipped: false },
  { id: "HEM-03", ward: "Hematology / Oncology", roomNumber: "HEM-303", status: "Occupied", patientId: "PAT-PREV-3", patientName: "S. Cohen (Lymphoma)", ventilatorEquipped: false },
  { id: "HEM-04", ward: "Hematology / Oncology", roomNumber: "HEM-304", status: "Available", ventilatorEquipped: false },
  
  { id: "STEP-01", ward: "Emergency Step-Down", roomNumber: "STEP-110", status: "Occupied", patientId: "PAT-103", patientName: "R. Evans (Pneumonia/Sepsis)", ventilatorEquipped: false },
  { id: "STEP-02", ward: "Emergency Step-Down", roomNumber: "STEP-111", status: "Available", ventilatorEquipped: false },
  { id: "STEP-03", ward: "Emergency Step-Down", roomNumber: "STEP-112", status: "Cleaning", ventilatorEquipped: false },

  { id: "GEN-01", ward: "General Ward", roomNumber: "GEN-401", status: "Occupied", patientName: "E. Zhang", ventilatorEquipped: false },
  { id: "GEN-02", ward: "General Ward", roomNumber: "GEN-402", status: "Available", ventilatorEquipped: false },
  { id: "GEN-03", ward: "General Ward", roomNumber: "GEN-403", status: "Available", ventilatorEquipped: false }
];

export const initialBloodInventory: BloodInventoryItem[] = [
  { bloodType: "O-", prbcUnits: 4, plateletUnits: 2, ffpUnits: 3, cryoUnits: 2, minThreshold: 6, status: "Critical Shortage" },
  { bloodType: "O+", prbcUnits: 28, plateletUnits: 9, ffpUnits: 14, cryoUnits: 8, minThreshold: 15, status: "Adequate" },
  { bloodType: "A-", prbcUnits: 6, plateletUnits: 3, ffpUnits: 5, cryoUnits: 3, minThreshold: 5, status: "Caution" },
  { bloodType: "A+", prbcUnits: 32, plateletUnits: 11, ffpUnits: 18, cryoUnits: 12, minThreshold: 18, status: "Adequate" },
  { bloodType: "B-", prbcUnits: 5, plateletUnits: 2, ffpUnits: 4, cryoUnits: 2, minThreshold: 4, status: "Caution" },
  { bloodType: "B+", prbcUnits: 19, plateletUnits: 7, ffpUnits: 10, cryoUnits: 6, minThreshold: 10, status: "Adequate" },
  { bloodType: "AB-", prbcUnits: 3, plateletUnits: 1, ffpUnits: 3, cryoUnits: 1, minThreshold: 3, status: "Caution" },
  { bloodType: "AB+", prbcUnits: 14, plateletUnits: 6, ffpUnits: 8, cryoUnits: 5, minThreshold: 8, status: "Adequate" }
];
