from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js default port
        "http://localhost:3001",  # Alternative port
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    id: str
    type: str
    text: str | None = None


class Edge(BaseModel):
    id: str
    source: str
    target: str


class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the pipeline forms a directed acyclic graph (DAG).
    Uses topological sort (Kahn's algorithm).
    """
    # Build adjacency list and calculate indegree
    node_ids = {node.id for node in nodes}
    graph: Dict[str, List[str]] = {node_id: [] for node_id in node_ids}
    indegree: Dict[str, int] = {node_id: 0 for node_id in node_ids}

    # Build graph from edges
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            graph[edge.source].append(edge.target)
            indegree[edge.target] = indegree.get(edge.target, 0) + 1

    # Find all nodes with no incoming edges
    queue = [node_id for node_id in node_ids if indegree[node_id] == 0]
    visited_count = 0

    # Process nodes
    while queue:
        current = queue.pop(0)
        visited_count += 1

        # Decrease indegree for neighbors
        for neighbor in graph[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    # If we visited all nodes, it's a DAG (no cycles)
    return visited_count == len(node_ids)


@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: PipelineRequest):
    """
    Parse a pipeline and return statistics.
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag_result = is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag_result,
    }


@app.get("/")
async def root():
    return {"message": "VectorShift Backend API"}
