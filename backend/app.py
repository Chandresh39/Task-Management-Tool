from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Allow frontend requests
tasks = []

@app.route("/tasks", methods=["GET", "POST"])
def handle_tasks():
    if request.method == "POST":
        data = request.json
        task = {
            "id": str(uuid.uuid4()),
            "title": data.get("title", ""),
            "completed": False,
            "priority": data.get("priority", "Medium"),
            "deadline": data.get("deadline"),
            "created_at": datetime.utcnow().isoformat()
        }
        tasks.append(task)
        return jsonify(task), 201
    return jsonify(tasks)

@app.route("/tasks/<task_id>", methods=["PATCH"])
def update_task(task_id):
    for task in tasks:
        if task["id"] == task_id:
            data = request.json
            task["completed"] = data.get("completed", task["completed"])
            return jsonify(task)
    return {"error": "Task not found"}, 404

@app.route("/tasks/filter", methods=["GET"])
def filter_tasks():
    status = request.args.get("status")
    deadline = request.args.get("deadline")

    filtered = tasks
    if status == "completed":
        filtered = [t for t in filtered if t["completed"]]
    elif status == "pending":
        filtered = [t for t in filtered if not t["completed"]]

    if deadline:
        filtered = [t for t in filtered if t["deadline"] == deadline]

    return jsonify(filtered)

if __name__ == "__main__":
    app.run(debug=True)
