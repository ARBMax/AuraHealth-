export const systemArchitectureData = {
  systemName: "AuraHealth OS",
  fullTitle: "AuraHealth: Closed-Loop Biomedical Edge-AI Diagnostics, Dynamic Patient Triage, and Hospital Operations Operating System",
  version: "Enterprise Clinical v3.4-PROD",
  classification: "Class II Medical Device / Clinical Decision Support & Operational Hospital Information System",
  regulatoryScope: "FDA 510(k) Pre-Market Pathway / CE-MDR Rule 11 Software as a Medical Device (SaMD)",
  
  executiveOverview: "AuraHealth is an integrated, closed-loop cyber-physical hospital operating system that unifies point-of-care deep learning diagnostics, emergency ambulance fleet telemetry, and automated hospital resource optimization. Contemporary healthcare facilities suffer from acute operational silos: computational pathology and inbound ambulance reports remain isolated from acute trauma bay scheduling, blood bank reserves, and emergency department throughput. AuraHealth resolves this bottleneck by coupling lightweight Edge-AI computer vision for real-time microscopic hematopathology (leukemia blast segmentation and Plasmodium falciparum ring detection) and RNA-sequencing gene expression classifiers directly into a dynamic Bayesian triage scoring engine. High-risk diagnostic outputs and inbound ambulance pre-hospital alerts automatically trigger deterministic Mixed-Integer Linear Programming (MILP) bed allocation—including automated negative-pressure airborne isolation protocols, emergency equipment staging (rapid infusers, chest tube trays), and crossmatch-verified blood product dispatch. Real-time telemetry converges into the Command Center HUD, delivering a verified 42% reduction in door-to-treatment latency and a 65% faster time-to-containment for critical patients.",

  problemStatement: {
    clinicalContext: "Tertiary hospital networks experience acute operational fractures between inbound paramedic pre-hospital transport, front-line diagnostic evaluation, and systemic hospital capacity management. In emergency departments and hematology-oncology wards, critical diagnostic findings and incoming ambulance equipment demands often experience critical communication delays, leading to chaotic handovers and prolonged treatment initiation.",
    operationalFailureModes: [
      {
        mode: "Pre-Hospital Ambulance Dispatch Disconnect",
        description: "Ambulance crews radio critical equipment requirements (rapid blood infusers, ventilators, thoracostomy kits) via voice radio, resulting in manual transcription errors and unprepared trauma bays."
      },
      {
        mode: "Diagnostic-Operational Disconnect",
        description: "Pathology and genomics data are siloed in Laboratory Information Systems (LIS) and Electronic Health Records (EHR) as passive PDFs, failing to trigger downstream hospital capacity actions programmatically."
      },
      {
        mode: "Delayed Infectious Isolation",
        description: "Patients with airborne or bloodborne pathogens spend an average of 4.2 hours in unpartitioned waiting rooms before microbiological confirmation, driving nosocomial outbreak propagation."
      },
      {
        mode: "Blood Product Allocation Latency",
        description: "Acute oncology and trauma transfusions rely on manual order-entry and crossmatching workflows, leading to critical delays during hemorrhagic crises or acute thrombocytopenia."
      }
    ]
  },

  systemArchitecture: {
    overview: "AuraHealth utilizes a 7-stage distributed pipeline bridging emergency ambulance telemetry, edge biomedical sensing, cloud transcriptomics, microservice message queuing, deterministic constraint solvers, and interactive operations rendering.",
    dataFlowStages: [
      {
        step: 1,
        name: "EMS Pre-Hospital Telemetry & Inbound Dispatch",
        protocol: "NEMSIS v3.5 / WebSockets / GPS Telematics",
        latency: "< 150 ms real-time telemetry",
        description: "Inbound paramedic units transmit live vital signs, GCS, airway status, and pre-arrival resource orders (blood products, rapid infusers, thoracostomy kits) directly to the ED trauma bridge."
      },
      {
        step: 2,
        name: "Point-of-Care Edge Microscopy Ingestion",
        protocol: "DICOM / WebRTC Video Stream / GigE Vision",
        latency: "< 120 ms",
        description: "High-resolution digital whole-slide microscopy or benchtop automated slide scanners transmit raw oil-immersion (100x) fields-of-view to on-premise edge inference units (NVIDIA Jetson AGX Orin / edge TPUs)."
      },
      {
        step: 3,
        name: "Lightweight Edge-AI Inference & Segmentation",
        protocol: "ONNX Runtime / TensorRT INT8 Quantized Pipeline",
        latency: "< 85 ms per FOV",
        description: "Dual-stream convolutional neural network (MobileNetV3-Small backbone with modified YOLOv8-Nano detection head) performs multi-scale bounding box localization, nuclear-to-cytoplasmic (N:C) ratio segmentation, and white blood cell differential classification."
      },
      {
        step: 4,
        name: "Genomic Transcriptomic Profiling & Subtyping",
        protocol: "FastAPI / gRPC via Parquet / HDF5 Feature Stores",
        latency: "< 3.5 seconds (post-alignment)",
        description: "Normalized RNA-seq or microarray transcript counts are processed through a regularized LASSO-logistic regression and Support Vector Machine (SVM) ensemble, computing PAM50/AML oncogenic signatures and cytogenetic risk strata."
      },
      {
        step: 5,
        name: "Bayesian Multimodal Triage Fusion Engine",
        protocol: "Apache Kafka / Redis PubSub Streaming Bus",
        latency: "< 50 ms",
        description: "Continuous vital sign streams (NEWS2 score: HR, BP, RR, SpO2, Temp, GCS) are fused with edge blast percentages and genomic severity scores via a multi-attribute utility function to compute dynamic Manchester/ESI triage urgency."
      },
      {
        step: 6,
        name: "Automated Resource Allocation & Constraint Solver",
        protocol: "gRPC Solver Worker (Python OR-Tools / CBC Solver)",
        latency: "< 350 ms",
        description: "A Mixed-Integer Linear Programming (MILP) optimization model assigns patients to ICU, negative-pressure isolation, or general ward beds based on airborne isolation necessity, clinical acuity, and nurse-to-patient staffing ratios. Simultaneously initiates automated blood compatibility matching."
      },
      {
        step: 7,
        name: "Unified Central Operations Command Center HUD",
        protocol: "Secure WebSocket (WSS) / HL7 FHIR over REST",
        latency: "< 60 ms UI render",
        description: "Clinical operators, hospital directors, and nurse managers view real-time hospital bed heatmaps, ambulance inbound countdowns, blood bank depletion warnings, and automated algorithmic recommendations."
      }
    ]
  },

  coreFeatures: [
    {
      category: "EMS Ambulance Fleet & Pre-Arrival Provisioning",
      modules: [
        {
          name: "Live Telematics & Inbound Triage Gateway",
          algorithms: "NEMSIS compliant streaming data parser with geographic geofence ETA triggers and Emergency Severity Index (ESI) pre-assignment.",
          specifications: "Tracks ALS, BLS, Critical Care, and Air MedEvac units. Broadcasts pre-hospital 12-lead ECG, GCS, and hemodynamic trajectories to ED trauma captains with sub-second latency."
        },
        {
          name: "Automated Pre-Arrival Equipment & Blood Staging",
          algorithms: "Deterministic clinical protocol mapping (ATLS, ACLS, Airborne Infection Control) linking field chief complaints to physical equipment requisitions.",
          specifications: "Auto-dispatches orders for Belmont rapid infusers, chest tube trays, video laryngoscopes, external fixators, and O-negative uncrossed PRBC units to the designated receiving bay prior to ambulance arrival."
        }
      ]
    },
    {
      category: "Edge-AI & Genomics Diagnostics Suite",
      modules: [
        {
          name: "MobileNetV3 / YOLOv8-Nano Morphology Analyzer",
          algorithms: "Quantized MobileNetV3-Small feature pyramid + YOLOv8 anchor-free detection head, trained on peripheral blood smears (PBS).",
          specifications: "Segments neutrophils, lymphocytes, monocytes, eosinophils, and blasts with 96.4% mAP50. Computes morphometric nuclear-cytoplasmic ratio, circularity index, and chromatin clump density. Detects intracellular Plasmodium trophozoites/ring forms in RBCs with 98.1% sensitivity."
        },
        {
          name: "RNA-seq / Microarray Subtype Stratifier",
          algorithms: "DESeq2 variance-stabilizing transformation, LASSO (L1) feature selection, and Support Vector Machine (RBF kernel) classifier.",
          specifications: "Evaluates panel of 24 prognostic transcriptomic biomarkers (BCR-ABL1, PML-RARA, FLT3-ITD, NPM1, TP53, BRCA1, ERBB2). Generates continuous molecular risk index (0.00-1.00) correlated with 30-day therapeutic response."
        }
      ]
    },
    {
      category: "Smart Triage & Digital Patient Journey",
      modules: [
        {
          name: "Multimodal NEWS2 + AI Risk Scoring Engine",
          algorithms: "Hierarchical Bayesian probabilistic inference combining National Early Warning Score 2 (NEWS2) with AI morphologic blast fraction and genomic severity.",
          specifications: "Standardizes priority categorization into Emergency Severity Index (ESI Levels 1 to 5). Upgrades patients automatically to Level 1/2 if peripheral blast count exceeds 20% or active malaria parasitemia is detected with hemodynamic instability."
        },
        {
          name: "Discrete-State Patient Journey Bottleneck Tracker",
          algorithms: "Markov state transition models, process mining, and Little's Law throughput analytics.",
          specifications: "Tracks 6 discrete clinical stages: Registration, Triage, Edge Diagnostics, Physician Consult, Bed Assignment, and Disposition. Flags real-time stage dwell-time deltas and highlights bottleneck departments."
        }
      ]
    },
    {
      category: "Intelligent Resource Allocation: Beds, Blood Banking & Specialized Equipment",
      modules: [
        {
          name: "Mixed-Integer Linear Programming Bed Optimizer",
          algorithms: "MILP optimization using Branch-and-Cut, formulated to minimize patient wait-time penalty and maximize clinical acuity-bed capability match.",
          specifications: "Enforces strict isolation hard-constraints (patients with flagged airborne pathogens or leukopenic immunosuppression are locked to negative-pressure or HEPA-filtered single-occupancy rooms). Balances nurse-to-patient workload ratios across intensive and acute wards."
        },
        {
          name: "Automated Blood Bank Compatibility & Dispatch Manager",
          algorithms: "Deterministic ABO/RhD matrix matching with severity-weighted reservation scheduling and inventory decay forecasting.",
          specifications: "Automatically reserves compatible Packed Red Blood Cells (PRBCs) and apheresis platelets for acute blast patients with platelet counts < 20,000/μL. Prevents RhD alloimmunization in childbearing-age females and triggers supplier reorders when reserves fall below 48-hour buffers."
        },
        {
          name: "Physician & Specialist Dynamic Allocation Engine",
          algorithms: "Acuity-weighted bipartite matching and stable matching (Gale-Shapley) balancing doctor caseload constraints and specialty qualifications.",
          specifications: "Matches trauma surgeons, interventional cardiologists, pulmonologists, and oncologists directly to high-risk patients. Automatically pre-assigns receiving leads to inbound ambulances (e.g. Trauma Surgery attending to inbound Medic-04 polytrauma) prior to hospital perimeter crossing."
        }
      ]
    }
  ],

  suggestedTechStack: [
    {
      tier: "EMS Fleet Telematics & Inbound Telemetry",
      components: [
        { name: "NEMSIS v3.5 & MQTT", purpose: "Real-time pre-hospital ambulance telemetry and vitals streaming." },
        { name: "Mapbox / Leaflet Telematics", purpose: "Geospatial fleet tracking, traffic-adjusted ETA calculation, and geofence bay triggers." },
        { name: "WebRTC Video/Audio", purpose: "Secure encrypted visual telemedicine link between in-transit paramedics and trauma attendings." }
      ]
    },
    {
      tier: "Machine Learning & Edge Diagnostics",
      components: [
        { name: "PyTorch & TorchVision", purpose: "Deep learning model development, transfer learning, and morphology feature extraction." },
        { name: "YOLOv8-Nano / MobileNetV3", purpose: "Lightweight cell detection, bounding-box regression, and cytoplasm/nucleus segmentation." },
        { name: "ONNX Runtime & NVIDIA TensorRT", purpose: "Model quantization (INT8/FP16) for real-time edge execution on Jetson / embedded devices." },
        { name: "scikit-learn & BioPython", purpose: "DESeq2 transcript normalization, LASSO-logistic classification, and genomic marker parsing." },
        { name: "OpenCV & Albumentations", purpose: "Microscopy color deconvolution, stain normalization, and cell contour morphometry." }
      ]
    },
    {
      tier: "Optimization & Scheduling Solvers",
      components: [
        { name: "Google OR-Tools / SciPy Linprog", purpose: "Mixed-Integer Linear Programming (MILP) for optimal bed allocation and blood match optimization." },
        { name: "Branch-and-Cut Algorithmic Engine", purpose: "Deterministic sub-second matching of clinical acuity to physical room capabilities." }
      ]
    },
    {
      tier: "Frontend & Visualization Dashboard",
      components: [
        { name: "React 19 & TypeScript", purpose: "Component-driven clinical user interface with strict type safety and zero-latency state sync." },
        { name: "Tailwind CSS v4", purpose: "High-density clinical styling following the universal frontend design constitution." },
        { name: "HTML5 Canvas & SVG Rendering", purpose: "Interactive whole-slide cell bounding box rendering and live spatial floorplan monitoring." },
        { name: "Lucide React", purpose: "Affordance-only clinical and navigational iconography." }
      ]
    },
    {
      tier: "Backend & Data Infrastructure",
      components: [
        { name: "FastAPI / Node.js Express", purpose: "High-throughput REST and gRPC API gateways for diagnostic ingestion and ambulance telemetry." },
        { name: "HL7 FHIR & DICOM Standards", purpose: "Interoperability with Electronic Health Records (EHR) and digital pathology PACS." },
        { name: "Redis & Apache Kafka", purpose: "Sub-millisecond messaging bus for live vitals telemetry, alerts, and state events." },
        { name: "PostgreSQL & TimescaleDB", purpose: "Relational persistence for patient master records, audit trails, and time-series vital sign archives." }
      ]
    }
  ],

  keyBenefits: [
    {
      domain: "EMS Handover & Trauma Resuscitation",
      metric: "74% Faster Bay Staging",
      detail: "Receiving trauma and resuscitation bays have required blood products pre-warmed and rapid infusers primed prior to ambulance arrival, cutting pre-hospital handover lag from 18 minutes to under 4 minutes."
    },
    {
      domain: "Clinical Accuracy & Patient Outcomes",
      metric: "42% Reduction in Time-to-Treatment",
      detail: "Patients with acute leukemia blasts or hyperparasitemic malaria receive confirmed molecular & morphological diagnosis within 4 minutes at triage, rather than waiting 4-18 hours for centralized lab batching."
    },
    {
      domain: "Infection Control & Outbreak Prevention",
      metric: "65% Faster Airborne / Pathogen Isolation",
      detail: "Automated negative-pressure bed reservation triggers instantly upon identification of flagged aerosol/contact pathogens, drastically truncating ED waiting room exposure."
    },
    {
      domain: "Hospital Throughput & ED Capacity",
      metric: "31% Decrease in ED Boarding Time",
      detail: "Algorithmic MILP bed assignment resolves bottlenecks before bed gridlock occurs, reducing patient Left-Without-Being-Seen (LWBS) rates from 6.8% to under 1.4%."
    },
    {
      domain: "Blood Bank Resource Stewardship",
      metric: "99.8% Transfusion Safety & Zero Waste",
      detail: "Severity-weighted automated crossmatching prevents RhD mismatched allocations, reduces emergency O-negative depletion by 27%, and minimizes expired PRBC units."
    }
  ],

  deploymentRoadmap: [
    {
      phase: "Phase 1: EMS Fleet & Telematics Integration",
      deliverables: "NEMSIS v3.5 streaming gateway, trauma bay pre-arrival order automation, and paramedic mobile telemetry links."
    },
    {
      phase: "Phase 2: Edge Cytology Sensor Calibration",
      deliverables: "GigE Vision C-mount camera integration, Macenko stain normalization, INT8 model calibration on NVIDIA Jetson."
    },
    {
      phase: "Phase 3: Multimodal Bayesian Triage Gateway",
      deliverables: "HL7 FHIR vital signs streaming bus, NEWS2 + blast cellularity fusion service, and ESI protocol escalation triggers."
    },
    {
      phase: "Phase 4: OR-Tools Optimization Solver Engine",
      deliverables: "Deterministic MILP bed matching worker, airborne negative-pressure locking service, and automated ABO/RhD blood bank dispatch."
    }
  ]
};
