# Tasks: Accessible Landmark Platform Website

**Input**: Design documents from `/specs/001-accessible-landmark-platform/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Configure Next.js for static export in `frontend/next.config.ts` (add `output: 'export'` and `images: { unoptimized: true }`)
- [ ] T002 [P] Create project directory structure per plan.md (create `frontend/data/`, `frontend/lib/storage/`, `frontend/lib/api/`, `frontend/lib/accessibility/`, `frontend/hooks/`, `frontend/types/`, `frontend/app/components/map/`, `frontend/app/components/chat/`, `frontend/app/components/records/`, `frontend/app/components/directory/`, `frontend/app/components/accessibility/`)
- [ ] T003 [P] Create embedded landmark data file `frontend/data/landmarks.json` with sample landmark data structure
- [ ] T004 [P] Create embedded medical professional data file `frontend/data/professionals.json` with sample professional data structure
- [ ] T005 [P] Create `.env.local.example` file in `frontend/` with environment variable templates (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, NEXT_PUBLIC_AI_API_URL, NEXT_PUBLIC_AI_API_KEY)
- [ ] T006 [P] Update `frontend/style/globals.css` with accessibility-focused base styles (color contrast, focus indicators, semantic spacing)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 [P] Create TypeScript type definitions for Landmark in `frontend/types/landmark.ts`
- [ ] T008 [P] Create TypeScript type definitions for MedicalProfessional in `frontend/types/professional.ts`
- [ ] T009 [P] Create TypeScript type definitions for Record in `frontend/types/record.ts`
- [ ] T010 [P] Create TypeScript type definitions for AttendanceConfirmation in `frontend/types/attendance.ts`
- [ ] T011 [P] Create TypeScript type definitions for ChatMessage in `frontend/types/chat.ts`
- [ ] T012 [P] Create base localStorage utility in `frontend/lib/storage/localStorage.ts` with error handling for private browsing mode
- [ ] T013 [P] Create records storage API in `frontend/lib/storage/records.ts` implementing RecordsStorageAPI interface from contracts
- [ ] T014 [P] Create attendance storage API in `frontend/lib/storage/attendance.ts` implementing AttendanceStorageAPI interface from contracts
- [ ] T015 [P] Create ARIA utilities in `frontend/lib/accessibility/aria.ts` for generating ARIA labels and roles
- [ ] T016 [P] Create keyboard navigation helpers in `frontend/lib/accessibility/keyboard.ts` for keyboard event handling
- [ ] T017 [P] Create SkipLink component in `frontend/app/components/accessibility/SkipLink.tsx` for skip-to-main-content functionality
- [ ] T018 [P] Create FocusTrap component in `frontend/app/components/accessibility/FocusTrap.tsx` for modal focus management
- [ ] T019 Create useLandmarks hook in `frontend/hooks/useLandmarks.ts` to load and manage embedded landmark data
- [ ] T020 Create useAttendance hook in `frontend/hooks/useAttendance.ts` to manage attendance confirmations using attendance storage API
- [ ] T021 Create useRecords hook in `frontend/hooks/useRecords.ts` to manage records CRUD operations using records storage API
- [ ] T022 [P] Create AI chat API client in `frontend/lib/api/chat.ts` implementing contract from `contracts/ai-chat-api.md`
- [ ] T023 Update root layout in `frontend/app/layout.tsx` to include SkipLink, proper semantic HTML structure, and ARIA landmarks

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Accessible Interactive Map with Landmarks (Priority: P1) 🎯 MVP

**Goal**: Users with visual or hearing impairments can access the main page featuring an interactive map where they can view embedded landmarks. When clicking on a landmark point, a modal displays location information with an option to confirm attendance.

**Independent Test**: Navigate to the main page, view the map with embedded landmarks, click on a landmark to see the modal, and confirm attendance. This delivers the core value proposition independently.

### Implementation for User Story 1

- [ ] T024 [P] [US1] Create InteractiveMap component in `frontend/app/components/map/InteractiveMap.tsx` with Google Maps integration using @react-google-maps/api
- [ ] T025 [P] [US1] Create LandmarkMarker component in `frontend/app/components/map/LandmarkMarker.tsx` for displaying landmark points on map with keyboard accessibility
- [ ] T026 [US1] Create LandmarkModal component in `frontend/app/components/map/LandmarkModal.tsx` to display landmark information with attendance confirmation button (depends on T025)
- [ ] T027 [US1] Implement main page in `frontend/app/page.tsx` integrating InteractiveMap, LandmarkMarker, and LandmarkModal components (depends on T024, T025, T026)
- [ ] T028 [US1] Add keyboard navigation support to map controls in `frontend/app/components/map/InteractiveMap.tsx` (Tab navigation, Enter/Space activation)
- [ ] T029 [US1] Add screen reader support to map and markers in `frontend/app/components/map/InteractiveMap.tsx` and `frontend/app/components/map/LandmarkMarker.tsx` (ARIA labels, live regions)
- [ ] T030 [US1] Integrate useLandmarks hook in main page to load embedded landmark data from `frontend/data/landmarks.json`
- [ ] T031 [US1] Integrate useAttendance hook in LandmarkModal to handle attendance confirmations
- [ ] T032 [US1] Add focus management to LandmarkModal using FocusTrap component when modal opens/closes
- [ ] T033 [US1] Add error handling for map loading failures (network errors, API key issues) with user-friendly messages
- [ ] T034 [US1] Ensure color contrast meets WCAG AA standards (4.5:1 for text, 3:1 for large text) in map components
- [ ] T035 [US1] Add loading states and empty states for map component

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can view the map, see embedded landmarks, click to view details, and confirm attendance.

---

## Phase 4: User Story 2 - AI Chat About Landmarks (Priority: P2)

**Goal**: Users can interact with an AI assistant on a dedicated chat page to ask questions about landmarks, receive information, and get assistance navigating the platform.

**Independent Test**: Navigate to the chat page, ask questions about landmarks, and receive relevant responses. This delivers value as a standalone help and information feature.

### Implementation for User Story 2

- [ ] T036 [P] [US2] Create ChatInterface component in `frontend/app/components/chat/ChatInterface.tsx` with accessible input controls and message display
- [ ] T037 [P] [US2] Create ChatMessage component in `frontend/app/components/chat/ChatMessage.tsx` for displaying individual messages with screen reader support
- [ ] T038 [US2] Create chat page in `frontend/app/chat_page/page.tsx` integrating ChatInterface and ChatMessage components (depends on T036, T037)
- [ ] T039 [US2] Integrate existing useChat hook in chat page to handle AI API communication using chat API client from `frontend/lib/api/chat.ts`
- [ ] T040 [US2] Add keyboard navigation to chat interface (Enter to send, Tab navigation, Escape to clear)
- [ ] T041 [US2] Add screen reader announcements for new messages in `frontend/app/components/chat/ChatInterface.tsx` using ARIA live regions
- [ ] T042 [US2] Add error handling for AI API failures (network errors, rate limits, timeouts) with user-friendly messages
- [ ] T043 [US2] Add loading states for AI responses in chat interface
- [ ] T044 [US2] Integrate landmark context in chat messages (pass landmark data to AI API for context-aware responses)
- [ ] T045 [US2] Ensure chat interface meets WCAG AA accessibility standards (color contrast, focus indicators, semantic HTML)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can chat with AI about landmarks.

---

## Phase 5: User Story 3 - Records Management (Priority: P2)

**Goal**: Users can manage a list of records in a to-do list style interface, allowing them to track tasks, appointments, or other items related to landmarks or medical services.

**Independent Test**: Navigate to the records page, create records, view the list, update items, and delete items. This delivers standalone value as a personal organization tool.

### Implementation for User Story 3

- [ ] T046 [P] [US3] Create RecordsList component in `frontend/app/components/records/RecordsList.tsx` for displaying to-do list with accessible controls
- [ ] T047 [P] [US3] Create RecordItem component in `frontend/app/components/records/RecordItem.tsx` for individual record items with edit/delete functionality
- [ ] T048 [US3] Create records page in `frontend/app/records/page.tsx` integrating RecordsList and RecordItem components (depends on T046, T047)
- [ ] T049 [US3] Integrate useRecords hook in records page to handle CRUD operations using records storage API
- [ ] T050 [US3] Add keyboard navigation to records interface (Tab navigation, Enter to edit, Delete key to remove)
- [ ] T051 [US3] Add screen reader support to records list (ARIA labels, status announcements for create/update/delete)
- [ ] T052 [US3] Add form validation for record creation/editing (title required, max length validation)
- [ ] T053 [US3] Add empty state for records list when no records exist
- [ ] T054 [US3] Add record status management (pending, completed, cancelled) with visual and accessible indicators
- [ ] T055 [US3] Add optional landmark linking to records (relatedLandmarkId field) with landmark selection UI
- [ ] T056 [US3] Ensure records interface meets WCAG AA accessibility standards

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Users can manage their to-do records.

---

## Phase 6: User Story 4 - Medical Professional Directory (Priority: P3)

**Goal**: Users can browse a directory of medical industry professionals, view their information, and access contact details.

**Independent Test**: Navigate to the directory page, browse professionals, view details, and access contact information. This delivers value as a standalone directory service.

### Implementation for User Story 4

- [ ] T057 [P] [US4] Create ProfessionalList component in `frontend/app/components/directory/ProfessionalList.tsx` for displaying directory with accessible navigation
- [ ] T058 [P] [US4] Create ProfessionalCard component in `frontend/app/components/directory/ProfessionalCard.tsx` for displaying individual professional information
- [ ] T059 [US4] Create directory page in `frontend/app/directory/page.tsx` integrating ProfessionalList and ProfessionalCard components (depends on T057, T058)
- [ ] T060 [US4] Load embedded professional data from `frontend/data/professionals.json` in directory page
- [ ] T061 [US4] Add keyboard navigation to directory (Tab navigation, Enter to view details)
- [ ] T062 [US4] Add screen reader support to directory (ARIA labels, semantic HTML structure)
- [ ] T063 [US4] Add search/filter functionality for professionals (optional enhancement - can be basic text search)
- [ ] T064 [US4] Add professional detail view/modal with full information and contact details
- [ ] T065 [US4] Ensure directory meets WCAG AA accessibility standards

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently. Users can browse medical professionals.

---

## Phase 7: User Story 5 - Contact Page (Priority: P3)

**Goal**: Users can access a contact page to find information about how to reach the organization or submit inquiries.

**Independent Test**: Navigate to the contact page and verify all contact information is accessible and properly formatted for screen readers.

### Implementation for User Story 5

- [ ] T066 [US5] Create contact page in `frontend/app/contact/page.tsx` with organization contact information
- [ ] T067 [US5] Add semantic HTML structure to contact page (address, phone, email with proper HTML5 elements)
- [ ] T068 [US5] Add keyboard navigation support to contact page (if contact form exists)
- [ ] T069 [US5] Add screen reader support to contact page (ARIA labels, proper heading structure)
- [ ] T070 [US5] Ensure contact page meets WCAG AA accessibility standards
- [ ] T071 [US5] Add optional contact form with accessible form controls (if specified in requirements)

**Checkpoint**: All user stories should now be independently functional. Users can access contact information.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T072 [P] Add navigation menu/header component in `frontend/app/components/Navigation.tsx` with links to all pages and keyboard navigation
- [ ] T073 [P] Update root layout in `frontend/app/layout.tsx` to include navigation menu
- [ ] T074 [P] Add consistent page titles and meta descriptions for all pages (SEO and accessibility)
- [ ] T075 [P] Add loading states and error boundaries across all pages
- [ ] T076 [P] Add graceful degradation for JavaScript-disabled browsers (noscript messages, basic HTML fallbacks)
- [ ] T077 [P] Run accessibility audit using automated tools (axe DevTools, Lighthouse) and fix issues
- [ ] T078 [P] Test with screen readers (NVDA, JAWS, VoiceOver) and fix accessibility issues
- [ ] T079 [P] Test keyboard-only navigation across all pages and fix issues
- [ ] T080 [P] Verify color contrast ratios meet WCAG AA standards across all components
- [ ] T081 [P] Add focus indicators to all interactive elements
- [ ] T082 [P] Optimize images and assets for performance (lazy loading, proper formats)
- [ ] T083 [P] Test build process (`npm run build`) and verify static export generates `out/` directory correctly
- [ ] T084 [P] Test across major browsers (Chrome, Firefox, Safari, Edge) with assistive technologies enabled
- [ ] T085 [P] Update documentation in `frontend/README.md` with setup and build instructions
- [ ] T086 Run quickstart.md validation to ensure all setup steps work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses useChat hook (already exists) and chat API client
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent, may optionally link to landmarks
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independent, uses embedded professional data
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Independent, simple static page

### Within Each User Story

- Components can be created in parallel when marked [P]
- Core components before integration
- Integration before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all parallel components for User Story 1 together:
Task: T024 [P] [US1] Create InteractiveMap component in frontend/app/components/map/InteractiveMap.tsx
Task: T025 [P] [US1] Create LandmarkMarker component in frontend/app/components/map/LandmarkMarker.tsx
Task: T030 [US1] Integrate useLandmarks hook in main page (can run after T019)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Interactive Map with Landmarks)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (P1 - MVP)
   - Developer B: User Story 2 (P2)
   - Developer C: User Story 3 (P2)
3. After P1 and P2 stories complete:
   - Developer A: User Story 4 (P3)
   - Developer B: User Story 5 (P3)
   - Developer C: Polish & Cross-Cutting (Phase 8)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **Important**: Landmarks are embedded static data (not user-created) per plan.md, despite spec mentioning "add landmarks"
- All tasks must ensure WCAG 2.1 Level AA compliance
- Test with assistive technologies at each checkpoint

---

## Task Summary

**Total Tasks**: 86

**Tasks by Phase**:
- Phase 1 (Setup): 6 tasks
- Phase 2 (Foundational): 17 tasks
- Phase 3 (User Story 1 - P1): 12 tasks
- Phase 4 (User Story 2 - P2): 10 tasks
- Phase 5 (User Story 3 - P2): 11 tasks
- Phase 6 (User Story 4 - P3): 9 tasks
- Phase 7 (User Story 5 - P3): 6 tasks
- Phase 8 (Polish): 15 tasks

**Parallel Opportunities**: 
- 35+ tasks can run in parallel across different files
- All user stories (Phase 3-7) can be worked on in parallel after Phase 2 completes

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1) = 35 tasks

**Independent Test Criteria**:
- **US1**: Navigate to main page, view map with landmarks, click landmark, view modal, confirm attendance
- **US2**: Navigate to chat page, ask question about landmarks, receive AI response
- **US3**: Navigate to records page, create record, view list, update record, delete record
- **US4**: Navigate to directory page, browse professionals, view details, access contact info
- **US5**: Navigate to contact page, view contact information, verify accessibility

