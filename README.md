# Dakma

**Interactive Sinhala Text Reader for the Visually Impaired Using OCR, NLP and AI**

Project website for research group **R26-DS-002**, Department of Computer Science,
Sri Lanka Institute of Information Technology (SLIIT), 2026.

---

## About the research

Visually impaired Sinhala speakers have no reliable way to read printed newspapers on their own.
Mainstream assistive readers are built around English. Open-source recognition of photographed
Sinhala pages gets about one word in three wrong, which is too many to follow by ear.

Dakma is a smartphone-based reader that:

1. guides a blind user to photograph a printed Sinhala page, using spoken directions and an automatic shutter;
2. isolates the article and recognises its headline and body text;
3. corrects recognition errors before the text is read aloud; and
4. answers spoken Sinhala questions about the article, in the answer style each listener prefers.

### Components

| | Component | Member | Student ID |
|---|---|---|---|
| C1 | Topological Sinhala Character Recognition via Medial Axis Transform | Muthunayaka M.J.J | IT22072238 |
| C2 | Context-Aware Sinhala Post-OCR Error Correction Model | Madhusanka H.P.I | IT22259134 |
| C3 | Advanced Document Retrieval and Information Generation | Devindi W.G.N | IT22120670 |
| C4 | Adaptive Conversational Personalization and Voice Interaction | Sathsara S.P.Y.B | IT22004468 |

**Supervisor:** Ms. Lakmini Abeywardhana
**Co-supervisor:** Ms. Adya Dissanayaka

### Key results

| Measure | Result |
|---|---|
| Body-text correction (C2), 217 locked test sentences | Character errors down 36.7%, word errors down 51.2% |
| Listening study (C2) | Words recovered by listeners rose from 60.0% to 79.2% |
| Headline recognition (C1), 8,872 test images | Mean CER 0.0586 (raw) against 0.0922 (MAT) |
| Grounded answers (C3), 72 test queries | 90.2% faithful to the evidence; 93.8% of unanswerable questions declined |
| Intent detection (C4), 45 unseen Sinhala commands | 77.78% correct at 1.53 s per command |
| Integration | 323 of 325 automated tests pass; demonstrated end to end at Progress Presentation 2 |

---

## The website

A single-page site that follows the SLIIT research website structure:

| Section | Contents |
|---|---|
| Home | Project summary and an animated example of OCR errors being corrected |
| Domain | Literature survey, research gap, research problem, objectives, methodology, technologies |
| Milestones | Each assessment with its date, marks and description, chosen from a drop-down |
| Documents | Project charter, proposal reports, checklists and final reports |
| Presentations | Slides from each assessment |
| About us | Supervisors and research team |
| Contact us | Contact details and a message form |

### Features

- Plain HTML, CSS and JavaScript: no framework, build step or external service
- Light and dark themes, following the visitor's system setting
- Responsive from mobile to desktop
- Accessible: keyboard navigation, visible focus, skip link, reduced-motion support,
  and a button that reads the project summary aloud
- Self-hosted fonts, so the site displays correctly without internet access to font services
- Total size under 1 MB (the course web limit is 20 MB)

---



© 2026 R26-DS-002 research team, Sri Lanka Institute of Information Technology.
