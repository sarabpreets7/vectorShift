# Assignment Starter (Downloaded) vs Your Project

This compares the **actual starter code** from the downloaded folder with your current project.

---

## Actual Starter Structure (from download)

**Path:** `frontend_technical_assessment/frontend_technical_assessment/`

### Backend (`backend/`)
- **main.py** – FastAPI with:
  - `GET /` → `{'Ping': 'Pong'}`
  - `GET /pipelines/parse` – takes `pipeline: str = Form(...)`, returns `{'status': 'parsed'}`
- **Required change:** Make it `POST /pipelines/parse` with JSON body `{nodes, edges}`, return `{num_nodes, num_edges, is_dag}` and add DAG logic.

### Frontend (`frontend/`)
- **Stack:** Create React App (CRA) + **React Flow** + **Zustand**
- **package.json:** `react`, `react-dom`, `react-scripts`, `reactflow`, `zustand` (via store)
- **Scripts:** `npm start` → `react-scripts start`

### Frontend files

| File | Purpose |
|------|--------|
| **src/App.js** | Renders PipelineToolbar, PipelineUI, SubmitButton |
| **src/store.js** | Zustand store: `nodes`, `edges`, addNode, onConnect, etc. (React Flow format) |
| **src/ui.js** | React Flow canvas; drag-and-drop; nodeTypes = InputNode, LLMNode, OutputNode, TextNode |
| **src/toolbar.js** | Toolbar with DraggableNode for Input, LLM, Output, Text |
| **src/draggableNode.js** | Draggable toolbar items |
| **src/submit.js** | **SubmitButton** – currently just a button; must be updated to send nodes/edges to backend and show alert |
| **src/nodes/inputNode.js** | Input node with Handle (React Flow), name/type inputs |
| **src/nodes/llmNode.js** | LLM node with Handles (system, prompt, response) |
| **src/nodes/outputNode.js** | Output node with Handle, name/type inputs |
| **src/nodes/textNode.js** | Text node with `{{input}}` in state, one Handle; **needs** dynamic size + variable handles (Part 3) |

### What the instructions expect you to do on the starter

1. **Part 1:** Add a **node abstraction** (shared base/components) so the four nodes don’t repeat code; add **5 new node types**.
2. **Part 2:** **Style** the app (starter has almost no styling – e.g. `border: '1px solid black'`).
3. **Part 3:** In **Text node** – (1) resize node with text, (2) parse `{{variable}}` and add a **Handle** per variable.
4. **Part 4:** In **submit.js** – on button click, send **nodes** and **edges** (from the store) to **POST /pipelines/parse**; show an **alert** with `num_nodes`, `num_edges`, `is_dag`.  
   In **backend** – implement **POST /pipelines/parse** with JSON body, compute counts and DAG, return `{num_nodes, num_edges, is_dag}`.

---

## Your Current Project

- **Stack:** **Next.js** (App Router) + Tailwind + no React Flow
- **Frontend path:** `node-flow/` (or you can rename to `frontend/`)
- **Backend:** `backend/` – already has **POST /pipelines/parse** with DAG logic ✅

### Differences

| Aspect | Starter | Your project |
|--------|--------|--------------|
| Framework | React (CRA) | Next.js |
| Canvas | React Flow (nodes/edges) | Custom grid + cards |
| State | Zustand (React Flow node/edge format) | React useState (custom node/edge shape) |
| Node defs | 4 files in `src/nodes/*.js` | Single abstraction in `src/nodes/` (types, library, utils) |
| submit | `src/submit.js` = SubmitButton component | `src/submit.ts` + used in `app/page.tsx` |
| Styling | Minimal | Tailwind + BEM |

Your implementation **satisfies the assignment requirements** (abstraction, 5 extra nodes, styling, text node behavior, backend + submit + alert), but it is **not** built on the starter code; it’s a different stack and structure.

---

## Options

### Option A: Keep your current project (recommended if you’re happy with it)

- You already meet all four parts in a different stack.
- In your README or submission notes, state:  
  “Implementation is in Next.js with a custom canvas; requirements (node abstraction, 5 new nodes, styling, text node logic, backend integration and alert) are implemented as specified.”

No need to change code to match the starter file‑for‑file.

### Option B: Align with the starter (use the downloaded folder as base)

If the assignment **must** be built on the provided starter:

1. **Copy the starter into your repo** (e.g. replace or add alongside current frontend/backend):
   - Use the downloaded `frontend_technical_assessment/frontend_technical_assessment/frontend` as your frontend.
   - Use the downloaded `backend` as your backend (then update `main.py` as in Part 4).

2. **Implement the four parts on that starter:**
   - **Part 1:** Introduce a shared node abstraction and add 5 new node types (new files in `src/nodes/` and register in `ui.js`).
   - **Part 2:** Add CSS/Tailwind (or similar) and style the nodes and app.
   - **Part 3:** In `textNode.js`, resize with content and parse `{{variable}}` to create Handles.
   - **Part 4:** In `submit.js`, read nodes/edges from the store, send to **POST /pipelines/parse**, show alert; in `backend/main.py`, implement POST and DAG.

3. **Run as in the instructions:**
   - Frontend: `cd frontend` → `npm i` → `npm start`
   - Backend: `cd backend` → `uvicorn main:app --reload`

---

## Summary

- **Yes, I can see the downloaded folder.**  
  Path used:  
  `.../frontend_technical_assessment-20260131T074358Z-3-001/frontend_technical_assessment/`  
  with `frontend/` (CRA + React Flow + Zustand) and `backend/` (FastAPI stub).

- **Starter has:**  
  `frontend/src/nodes/` (inputNode, llmNode, outputNode, textNode), `frontend/src/submit.js` (SubmitButton), and a GET `/pipelines/parse` stub.

- **Your project** implements the same requirements (abstraction, 5 nodes, styling, text behavior, backend + submit + alert) in Next.js and custom UI.

- **If the brief allows any stack:** your current project is enough; just document that it’s Next.js and how each part is satisfied.

- **If the brief requires building on the starter:** use Option B and implement the four parts inside the downloaded `frontend` and `backend` as above.
