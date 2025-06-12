
# Fituno – User Stories & Acceptance Criteria (MVP)
_Last updated: 2025-06-11_

## Legend
- **Roles**  
  - **TR** – Trainer (Web)  
  - **CL** – Client (Mobile)  
  - **SYS** – System / Backend  
  - **ADM** – Platform Administrator
- **Priority (MoSCoW)**  
  - **M** – Must (required for MVP)  
  - **S** – Should (high value, but not strictly blocking MVP)  
  - **C** – Could (nice‑to‑have)  
  - **W** – Won’t (explicitly out of scope for MVP)

---

## Epic 1 – Authentication & Account Management

| ID | User Story | Priority |
|----|------------|----------|
| US‑AUTH‑01 | **As** TR/CL, **I want** to log in with e‑mail & password, **so that** I can access my account securely. | M |
| US‑AUTH‑02 | **As** TR/CL, **I want** to log in with Google / Facebook, **so that** I can sign in quickly without a new password. | S |
| US‑AUTH‑03 | **As** newly‑registered user, **I want** the system to send a verification e‑mail, **so that** unverified accounts cannot access protected data. | M |
| US‑AUTH‑04 | **As** user, **I want** to reset my password via “Forgot password”, **so that** I can regain access if I forget credentials. | M |
| US‑AUTH‑05 | **As** user, **I want** my session to expire safely after logout / timeout, **so that** my data stays private on shared devices. | M |
| US‑AUTH‑06 | **As** social‑login user who changed avatar, **I want** my custom photo to persist on the next login, **so that** it is not overwritten. | C |
| US‑AUTH‑07 | **As** user, **I want** to accept the latest Terms of Use before accessing the app, **so that** legal compliance is enforced. | M |
| US‑AUTH‑08 | **As** user on offline mode with outdated terms, **I want** a restricted banner until I reconnect, **so that** I’m aware of pending acceptance. | S |
| US‑AUTH‑09 | **As** user, **I want** timezone changes to immediately reflect on all date displays, **so that** my schedule remains accurate. | S |

<details>
<summary>Acceptance Criteria examples (Given/When/Then)</summary>

**US‑AUTH‑01 – E‑mail login**  
*Given* an existing user on the login screen  
*When* they enter a valid e‑mail & password and press **Login**  
*Then* SYS authenticates via Supabase Auth and redirects:  
&nbsp;&nbsp;• TR → Dashboard • CL → next required step (anamnese / workout / dashboard).  

</details>

---

## Epic 2 – Plan & Subscription (Stripe)

| ID | User Story | Priority |
|----|------------|----------|
| US‑PLAN‑01 | **As** TR on a Free plan, **I want** to be limited to 2 active clients, **so that** I understand the free tier boundaries. | M |
| US‑PLAN‑02 | **As** TR, **I want** to upgrade to PRO via Stripe checkout, **so that** I can work with unlimited clients. | M |
| US‑PLAN‑03 | **As** TR with expired plan, **I want** write actions blocked and a persistent banner, **so that** I know to renew. | M |
| US‑PLAN‑04 | **As** TR exceeding client limit, **I want** a clear error and upgrade prompt, **so that** I can decide to pay or inactivate clients. | S |

---

## Epic 3 – Client Management

| ID | User Story | Priority |
|----|------------|----------|
| US‑CM‑01 | **As** TR, **I want** to invite a client by e‑mail, **so that** they can register and link to me. | M |
| US‑CM‑02 | **As** TR, **I want** to inactivate (not delete) clients, **so that** history remains but counts toward limits. | M |
| US‑CM‑03 | **As** CL who changes trainer, **I want** the app to auto‑update workouts & chat, **so that** I always see the current trainer’s data. | S |
| US‑CM‑04 | **As** TR, **I want** to filter my client list by status (no anamnese, no series, inactive), **so that** I focus on pending actions. | S |
| US‑CM‑05 | **As** SYS, **I want** RLS to restrict data so trainers can only see their clients, **so that** privacy is enforced. | M |

---

## Epic 4 – Anamnese (Questionnaire)

| ID | User Story | Priority |
|----|------------|----------|
| US‑ANA‑01 | **As** CL, **I want** to answer an anamnese before first workout, **so that** my trainer can create a personalised plan. | M |
| US‑ANA‑02 | **As** TR, **I want** to create custom anamnese templates, **so that** I can adapt questions to my methodology. | S |
| US‑ANA‑03 | **As** TR, **I want** to request a new anamnese at any time, **so that** I keep client data up‑to‑date. | S |
| US‑ANA‑04 | **As** SYS, **I want** new trainers to force a fresh anamnese, **so that** previous answers are not reused incorrectly. | S |

---

## Epic 5 – Workout Builder (Trainer)

| ID | User Story | Priority |
|----|------------|----------|
| US‑WB‑01 | **As** TR, **I want** a drag‑and‑drop weekly board, **so that** I can visually build workouts per day. | M |
| US‑WB‑02 | **As** TR, **I want** a searchable exercise drawer with filters, **so that** I can find suitable exercises quickly. | M |
| US‑WB‑03 | **As** TR, **I want** to create supersets/circuits, **so that** I can program complex sessions. | S |
| US‑WB‑04 | **As** TR Free with >2 clients, **I want** publish blocked with an upgrade banner, **so that** I see paywall rules. | S |
| US‑WB‑05 | **As** TR, **I want** real‑time validation (volume, equipment), **so that** I catch issues before saving. | S |
| US‑WB‑06 | **As** TR, **I want** to duplicate a running series to edit future dates, **so that** I respect versioning rules. | S |

---

## Epic 6 – Workout Execution (Client)

| ID | User Story | Priority |
|----|------------|----------|
| US‑EXE‑01 | **As** CL, **I want** today’s workout to show automatically, **so that** I know what to do. | M |
| US‑EXE‑02 | **As** CL, **I want** to mark sets done and edit load, **so that** my progress is accurate. | M |
| US‑EXE‑03 | **As** CL, **I want** to run workouts offline, **so that** lack of internet doesn’t block training. | M |
| US‑EXE‑04 | **As** CL, **I want** to manually conclude a workout even if incomplete, **so that** forgotten sets don’t block history. | S |
| US‑EXE‑05 | **As** CL, **I want** to substitute an exercise with system suggestions (same muscle/equipment), **so that** I handle equipment unavailability. | S |

---

## Epic 7 – Progress Tracking & Media

| ID | User Story | Priority |
|----|------------|----------|
| US‑PRO‑01 | **As** CL, **I want** load & rep graphs per exercise, **so that** I can visualise my improvement. | C |
| US‑PRO‑02 | **As** CL, **I want** to upload progress photos compressed, **so that** uploads are quick and storage is efficient. | S |
| US‑PRO‑03 | **As** CL offline, **I want** progress saved locally and synced later, **so that** data isn’t lost. | S |

---

## Epic 8 – Chat

| ID | User Story | Priority |
|----|------------|----------|
| US‑CHAT‑01 | **As** TR/CL, **I want** 1:1 chat per client, **so that** communication stays centralised. | M |
| US‑CHAT‑02 | **As** CL, **I want** to send a message linked to the current exercise, **so that** trainer sees context. | S |
| US‑CHAT‑03 | **As** CL offline, **I want** sending states (sending/error) and retry logic, **so that** I know message status. | S |
| US‑CHAT‑04 | **As** CL, **I want** a fallback if the referenced exercise was removed, **so that** chat remains readable. | S |

---

## Epic 9 – Offline Support & Synchronisation

| ID | User Story | Priority |
|----|------------|----------|
| US‑OFF‑01 | **As** CL, **I want** essential data cached for one week, **so that** I can train without internet. | M |
| US‑OFF‑02 | **As** SYS, **I want** sync retries with exponential back‑off, **so that** servers are not overloaded. | S |
| US‑OFF‑03 | **As** SYS, **I want** conflict resolution “last write wins” for MVP, **so that** offline edits merge deterministically. | S |
| US‑OFF‑04 | **As** user reinstalling app offline, **I want** a clear alert if animations aren’t available, **so that** I understand missing media. | S |

---

## Epic 10 – Internationalisation & Units

| ID | User Story | Priority |
|----|------------|----------|
| US‑I18N‑01 | **As** user, **I want** the app in PT‑BR, EN, ES, **so that** I can use it in my language. | M |
| US‑I18N‑02 | **As** SYS, **I want** a fallback to PT‑BR if translation missing, **so that** text is never blank. | M |
| US‑I18N‑03 | **As** user, **I want** to change language in settings without restarting, **so that** I switch on the fly. | S |
| US‑I18N‑04 | **As** user, **I want** to switch between kg/lb and km/mi, **so that** units fit my preference. | S |

---

## Epic 11 – Media & Animations

| ID | User Story | Priority |
|----|------------|----------|
| US‑MEDIA‑01 | **As** SYS, **I want** exercise animations served from Supabase Storage, **so that** apps stay lightweight. | M |
| US‑MEDIA‑02 | **As** CL, **I want** weekly animations pre‑cached, **so that** playback is instant. | S |
| US‑MEDIA‑03 | **As** SYS, **I want** a fallback icon if Lottie fails, **so that** UI degrades gracefully. | S |

---

## Epic 12 – Legal & Account Closure

| ID | User Story | Priority |
|----|------------|----------|
| US‑LEGAL‑01 | **As** user, **I want** to read & accept Terms and Privacy at first login, **so that** I comply with policies. | M |
| US‑LEGAL‑02 | **As** SYS, **I want** to force re‑acceptance when terms version changes, **so that** legal updates propagate. | M |
| US‑LEGAL‑03 | **As** user, **I want** a permanent link to legal docs in “My Account”, **so that** I can review them any time. | S |
| US‑LEGAL‑04 | **As** user, **I want** to request account deletion by e‑mail, **so that** I can exercise my data rights. | W |

---

## Epic 13 – Non‑Functional (Security, Performance, Quality)

| ID | User Story | Priority |
|----|------------|----------|
| US‑NFR‑01 | **As** SYS, **I want** RLS to restrict queries by role, **so that** data is isolated. | M |
| US‑NFR‑02 | **As** SYS, **I want** JWT tokens stored httpOnly (Web) / SecureStore (Mobile), **so that** credentials are safe. | M |
| US‑NFR‑03 | **As** DEV, **I want** CI with tests ≥70 % coverage, **so that** regressions are caught early. | C |
| US‑NFR‑04 | **As** user, **I want** virtualised lists & skeleton loaders, **so that** UI stays smooth on large datasets. | S |
| US‑NFR‑05 | **As** SYS, **I want** React Query cache times tuned per entity, **so that** network usage is optimal. | S |

---

## Edge‑Case Supplement (Selected)

| ID | Scenario | Priority |
|----|----------|----------|
| EC‑01 | Login social re‑used after custom avatar → avatar must persist | C |
| EC‑02 | Client sends chat linked to removed exercise → show “exercise unavailable” tag | S |
| EC‑03 | App reinstalls offline with no cached animations → show global alert | S |
| EC‑04 | New trainer links existing e‑mail client → inactivate old trainer, request new anamnese | S |
| EC‑05 | Plan expires while client is mid‑workout → allow finishing current session but block new workouts | S |

---

### Change Log

| Date | Description |
|------|-------------|
| 2025‑06‑11 | Initial consolidated doc created from PRD + Arquitetura + Monorepo + edge cases. |

