# Project Structure vs Assignment Instructions

This document explains how the current project structure maps to the [VectorShift Frontend Technical Assessment](https://drive.google.com/drive/u/0/folders/1ENWF8SIfbMw_wA5VxSoLMGacffndOOzJ) folder layout.

## Assignment Expected Structure (from Google Drive)

```
/frontend          ← npm i, npm start
  /src
    /nodes         ← JS files for input, output, llm, text nodes
    submit.js      ← send pipeline to /pipelines/parse
/backend           ← uvicorn main:app --reload
  main.py
```

## This Project’s Structure

```
/node-flow         ← frontend (run: npm i, npm start)
  /src
    /nodes         ← Node abstraction (Part 1)
      types.ts     ← shared types
      library.ts   ← NODE_LIBRARY, TEMPLATE_MAP, paletteAccents
      utils.ts     ← extractVariables, isDag, makeId (Part 3)
      index.ts     ← re-exports
    submit.ts      ← submitPipeline() – Part 4 backend integration
    submit.js      ← re-exports submit.ts (assignment path: frontend/src/submit.js)
  /app             ← Next.js App Router (layout, page, globals.css)

/backend           ← uvicorn main:app --reload
  main.py          ← /pipelines/parse, DAG check
```

## Mapping to Instructions

| Instruction | Location in this repo |
|------------|------------------------|
| “Files in /frontend/src” | `node-flow/src/` |
| “Folder called nodes” (Part 1) | `node-flow/src/nodes/` |
| “Update /frontend/src/submit.js” (Part 4) | `node-flow/src/submit.ts` + `node-flow/src/submit.js` (re-export) |
| “Navigate to /frontend, npm i, npm start” | Navigate to `node-flow`, run `npm i` then `npm start` |
| “Navigate to /backend, uvicorn main:app --reload” | Navigate to `backend`, run `uvicorn main:app --reload` |

## Optional: Match “frontend” Name Exactly

To use a top-level folder named `frontend` instead of `node-flow`:

```bash
mv node-flow frontend
```

Then run:

- Frontend: `cd frontend && npm i && npm start`
- Backend: `cd backend && source venv/bin/activate && uvicorn main:app --reload`
- Or use: `./start-frontend.sh` / `./start-backend.sh` after updating those scripts to use `frontend` instead of `node-flow`.

## Summary

- **Node abstraction (Part 1):** Implemented under `src/nodes/` (types, library, utils).
- **Submit / Part 4:** Implemented in `src/submit.ts`; `src/submit.js` exists for the requested path.
- **Run commands:** Same as instructions: frontend = `npm i` + `npm start` (from `node-flow` or `frontend`), backend = `uvicorn main:app --reload` from `backend`.
