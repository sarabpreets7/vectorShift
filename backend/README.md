# VectorShift Backend

FastAPI backend for the VectorShift frontend technical assessment.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --reload
```

The server will run on `http://localhost:8000` by default.

## API Endpoints

### POST `/pipelines/parse`

Parse a pipeline and return statistics.

**Request Body:**
```json
{
  "nodes": [
    {"id": "node-1", "type": "input"},
    {"id": "node-2", "type": "text", "text": "Hello {{name}}!"}
  ],
  "edges": [
    {"id": "edge-1", "source": "node-1", "target": "node-2"}
  ]
}
```

**Response:**
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

## DAG Detection

The endpoint uses topological sort (Kahn's algorithm) to determine if the pipeline forms a directed acyclic graph (DAG). A cycle in the graph will result in `is_dag: false`.
