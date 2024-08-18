import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherDashboard = () => {
  const [classroom, setClassroom] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [newTimetableEntry, setNewTimetableEntry] = useState({
    day: "",
    startTime: "",
    endTime: "",
    subject: "",
  });
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchClassroom();
    fetchTimetable();
  }, []);

  const fetchClassroom = async () => {
    try {
      const res = await axios.get("https://classroom-4v2s.onrender.com/api/teacher/classroom");
      setClassroom(res.data);
    } catch (err) {
      console.error("Error fetching classroom:", err);
    }
  };

  const fetchTimetable = async () => {
    try {
      const res = await axios.get("https://classroom-4v2s.onrender.com/api/teacher/timetable");
      setTimetable(res.data);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    }
  };

  const handleTimetableChange = (e) => {
    const { name, value } = e.target;
    setNewTimetableEntry({ ...newTimetableEntry, [name]: value });
  };

  const handleTimetableSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://classroom-4v2s.onrender.com/api/teacher/timetable", newTimetableEntry);
      setTimetable([...timetable, res.data]);
      setNewTimetableEntry({ day: "", startTime: "", endTime: "", subject: "" });
    } catch (err) {
      console.error("Error creating timetable entry:", err);
    }
  };

  return (
    <div className="teacher-dashboard p-8 bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Teacher Dashboard</h1>

      {/* Section 1: Classroom Information */}
      <section className="mb-8 text-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Assigned Classroom</h2>
        {classroom ? (
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="text-xl font-bold mb-2">{classroom.name}</h3>
            <p>Time: {classroom.startTime} - {classroom.endTime}</p>
            <p>Days: {classroom.days.join(", ")}</p>
          </div>
        ) : (
          <p>No classroom assigned.</p>
        )}
      </section>

      {/* Section 2: Timetable Management */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">Manage Timetable</h2>
        <form onSubmit={handleTimetableSubmit} className="space-y-4">
          <select
            name="day"
            value={newTimetableEntry.day}
            onChange={handleTimetableChange}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded"
          >
            <option value="">Select Day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="startTime"
            placeholder="Start Time"
            value={newTimetableEntry.startTime}
            onChange={handleTimetableChange}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded"
            required
          />
          <input
            type="text"
            name="endTime"
            placeholder="End Time"
            value={newTimetableEntry.endTime}
            onChange={handleTimetableChange}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={newTimetableEntry.subject}
            onChange={handleTimetableChange}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Add Timetable Entry
          </button>
        </form>
      </section>

      {/* Section 3: Display Timetable */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">Classroom Timetable</h2>
        <table className="min-w-full bg-gray-800 border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="py-2 px-4 border-b border-gray-600">Day</th>
              <th className="py-2 px-4 border-b border-gray-600">Start Time</th>
              <th className="py-2 px-4 border-b border-gray-600">End Time</th>
              <th className="py-2 px-4 border-b border-gray-600">Subject</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((entry, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-600">{entry.day}</td>
                <td className="py-2 px-4 border-b border-gray-600">{entry.startTime}</td>
                <td className="py-2 px-4 border-b border-gray-600">{entry.endTime}</td>
                <td className="py-2 px-4 border-b border-gray-600">{entry.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TeacherDashboard;
