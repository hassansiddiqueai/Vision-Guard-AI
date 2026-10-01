# VisionGuard AI — 2-to-3 Minute Hackathon Demo Script

**Presenter Guidelines:**
* Keep screen sharing on [http://localhost:5173](http://localhost:5173).
* Speak clearly with an industrial operations tone.
* Demonstrate the full closed-loop workflow: **Camera ➔ Detection ➔ Alert ➔ Evidence ➔ Incident ➔ Report**.

---

### [0:00 – 0:20] The Problem
> *"Hello judges! Every year, industrial workplaces suffer thousands of preventable accidents because safety supervisors cannot manually monitor every square foot of an active construction site. Falling object hazards, missing scaffold pins, and unlatched harnesses often go completely unnoticed until disaster strikes."*

---

### [0:20 – 0:40] The VisionGuard Solution
> *"This is VisionGuard AI: an AI-Powered Computer Vision Safety Control Center. VisionGuard transforms live CCTV cameras, drone feeds, and field photos into an automated, closed-loop safety intelligence system that detects hazards, scores risk, dispatches incident tickets, and ensures OSHA regulatory compliance in real time."*

---

### [0:40 – 1:00] Dashboard Operations & Safety Score
*(Action: Click on Dashboard at `/dashboard`)*
> *"On our Dashboard, safety managers get real-time operational telemetry. Notice our composite Site Safety Score: 86 out of 100, calculated dynamically from PPE compliance, open incidents, and critical hazard frequency. We can monitor active CCTV streams across our facilities and track 7-day inspection velocity."*

---

### [1:00 – 1:20] Live Camera Stream & Computer Vision HUD
*(Action: Navigate to Live Monitoring at `/live-monitoring`, click 'Connect Camera' or select a scenario)*
> *"Let's open Live Monitoring. VisionGuard seamlessly integrates with the browser's MediaDevices API to ingest camera feeds at 30 frames per second. Our edge vision engine overlays real-time bounding boxes around workers, equipment, and structural joints with millisecond latency."*

---

### [1:20 – 1:40] AI Hazard Detection & Critical Sound Alert
*(Action: Click on `[ PPE Violation ]` or `[ Restricted Zone ]`)*
> *"Watch what happens when an anomaly occurs. When our model identifies a worker entering an active zone without an ANSI hard hat, it immediately calculates a High Risk score of 86% and sounds an audible alarm chime to notify site officers."*

---

### [1:40 – 2:00] Evidence Capture & Incident Dispatch
*(Action: Click 'Capture Evidence', then 'Create Incident Record', enter supervisor name, and click 'Save & Assign')*
> *"Rather than stopping at a simple alert, VisionGuard converts detection into operational action. We capture a forensic visual evidence frame, generate an Incident Record, and assign an immediate corrective action to the Site Safety Lead."*

---

### [2:00 – 2:20] Incident Resolution & Dynamic Dashboard Sync
*(Action: Navigate to Incidents at `/incidents` and click 'Verify & Resolve')*
> *"In our Incident Management matrix, supervisors track open and resolved tickets. When we click 'Verify & Resolve', our database updates immediately, our Site Safety Score improves on the dashboard, and mean-time-to-resolution is logged."*

---

### [2:20 – 2:40] Regulatory Audit Report Generation
*(Action: Navigate to Reports at `/reports` and show the formatted OSHA audit sheet)*
> *"Finally, in our Reports section, VisionGuard automatically compiles photographic evidence, executive summaries, and mapped OSHA 1926 standards into a verifiable compliance report ready for OSHA inspectors."*

---

### [2:40 – 3:00] Architecture, Security & Final Value
> *"Under the hood, VisionGuard uses a zero-exposure AI architecture where Gemini Vision API keys remain strictly on the backend, communicating through validated JSON schemas and relational database persistence. VisionGuard turns passive cameras into active workplace safety intelligence. Thank you!"*
