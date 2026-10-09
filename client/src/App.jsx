import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    axios
      .post("http://localhost:5000/students", {
        name,
        course,
        age,
      })
      .then((response) => {
        setStudents([...students, response.data]);
        setName("");
        setCourse("");
        setAge("");
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/students/${id}`)
      .then(() => {
        fetchStudents();
      })
      .catch((error) => {
        console.log("Error deleting student:", error);
      });
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };

  const handleUpdateStudent = () => {
    axios
      .put(`http://localhost:5000/students/${editingId}`, {
        name,
        course,
        age,
      })
      .then(() => {
        fetchStudents();
        setEditingId(null);
        setName("");
        setCourse("");
        setAge("");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Student Management System</h1>

      <h2>Add Student</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <input
        type="text"
        placeholder="Course"
        value={course}
        onChange={(event) => setCourse(event.target.value)}
      />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(event) => setAge(event.target.value)}
      />

      <button onClick={editingId ? handleUpdateStudent : handleAddStudent}>
        {editingId ? "Update Student" : "Add Student"}
      </button>

      <h2>Students</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>

          <button onClick={() => handleEdit(student)}>
            Edit
          </button>

          <button onClick={() => handleDelete(student._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;