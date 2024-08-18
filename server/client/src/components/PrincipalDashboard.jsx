import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { login } from "../store/authSlice";
const PrincipalDashboard = () => {
  const dispatch = useDispatch()
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [userRole,setUserRole] = useState("")
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    startTime: "",
    endTime: "",
    days: [],
  });
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Fetch users and classrooms when component mounts
  useEffect(() => {
    fetchUsers();
    fetchClassrooms();
  }, []);
  React.useEffect(() => {
    axios.get("https://classroom-4v2s.onrender.com//profile", {
        withCredentials: true
    })
        .then(res => {
          console.log(res.data.user);
            const data = res.data.user;
            setUserRole(data.role)
            dispatch(login(data));
            console.log(data);

        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
}, [dispatch]);
  // Fetch all users and filter them by role
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://classroom-4v2s.onrender.com//list");
      const allUsers = res.data;
      setTeachers(allUsers.filter((user) => user.role === "teacher"));
      setStudents(allUsers.filter((user) => user.role === "student"));
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch classrooms and map them with the respective teacher names
  const fetchClassrooms = async () => {
    try {
      const res = await axios.get("https://classroom-4v2s.onrender.com//list-classroom");
      const classroomsWithTeachers = res.data.map((classroom) => ({
        ...classroom,
        teacherName: teachers.find((t) => t._id === classroom.teacher)?.name || "Unassigned",
      }));
      setClassrooms(classroomsWithTeachers);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle classroom creation
  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://classroom-4v2s.onrender.com//api/classroom/create",
        newClassroom
      );
      setClassrooms([...classrooms, res.data]);
      setNewClassroom({ name: "", startTime: "", endTime: "", days: [] });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle assigning a teacher to a classroom
  const handleAssignTeacher = async (classroomId, teacherId) => {
    try {
      await axios.put(
        `https://classroom-4v2s.onrender.com//api/classroom/assign-teacher/${classroomId}`,
        { teacherId }
      );
      fetchClassrooms(); // Refresh classrooms after assignment
    } catch (err) {
      console.error(err);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`https://classroom-4v2s.onrender.com//api/classroom/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle deleting a classroom
  const handleDeleteClassroom = async (classroomId) => {
    try {
      await axios.delete(`https://classroom-4v2s.onrender.com//api/classroom/${classroomId}`);
      setClassrooms(classrooms.filter((classroom) => classroom._id !== classroomId));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle day selection for classroom creation
  const handleDayChange = (day) => {
    if (newClassroom.days.includes(day)) {
      setNewClassroom({
        ...newClassroom,
        days: newClassroom.days.filter((d) => d !== day),
      });
    } else {
      setNewClassroom({ ...newClassroom, days: [...newClassroom.days, day] });
    }
  };

  // Handle selecting all days for classroom creation
  const handleSelectAllDays = () => {
    if (newClassroom.days.length === daysOfWeek.length) {
      setNewClassroom({ ...newClassroom, days: [] });
    } else {
      setNewClassroom({ ...newClassroom, days: daysOfWeek });
    }
  };

  return (
    <div className="principal-dashboard p-8 bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Principal Dashboard</h1>

      {/* Section 1: Teachers and Students Table */}
      <section className="mb-8 text-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Teachers and Students</h2>
        <div>
          <h3 className="text-xl font-bold mb-2">Teachers</h3>
          <table className="min-w-full bg-gray-800 border border-gray-700 mb-8">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="py-2 px-4 border-b border-gray-600">Name</th>
                <th className="py-2 px-4 border-b border-gray-600">Email</th>
                <th className="py-2 px-4 border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td className="py-2 px-4 border-b border-gray-600">{teacher.name}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{teacher.email}</td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <button
                      onClick={() => handleDeleteUser(teacher._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-xl font-bold mb-2">Students</h3>
          <table className="min-w-full bg-gray-800 border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="py-2 px-4 border-b border-gray-600">Name</th>
                <th className="py-2 px-4 border-b border-gray-600">Email</th>
                <th className="py-2 px-4 border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="py-2 px-4 border-b border-gray-600">{student.name}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{student.email}</td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <button
                      onClick={() => handleDeleteUser(student._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Create Classroom */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">Create a Classroom</h2>
        <form onSubmit={handleCreateClassroom} className="space-y-4">
          <input
            type="text"
            placeholder="Classroom Name"
            value={newClassroom.name}
            onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded"
          />
          <input
            type="text"
            placeholder="Start Time"
            value={newClassroom.startTime}
            onChange={(e) => setNewClassroom({ ...newClassroom, startTime: e.target.value })}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded"
          />
          <input
            type="text"
            placeholder="End Time"
            value={newClassroom.endTime}
            onChange={(e) => setNewClassroom({ ...newClassroom, endTime: e.target.value })}
            className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded"
          />
          <div>
            <label className="text-gray-200 font-semibold">Select Days:</label>
            <div className="flex text-gray-200 items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newClassroom.days.length === daysOfWeek.length}
                  onChange={handleSelectAllDays}
                  className="mr-2"
                />
                Select All
              </label>
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newClassroom.days.includes(day)}
                    onChange={() => handleDayChange(day)}
                    className="mr-2"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Classroom
          </button>
        </form>
      </section>

      {/* Section 3: Classrooms Table */}
      <section className="text-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Classrooms</h2>
        <table className="min-w-full bg-gray-800 border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="py-2 px-4 border-b border-gray-600">Name</th>
              <th className="py-2 px-4 border-b border-gray-600">Start Time</th>
              <th className="py-2 px-4 border-b border-gray-600">End Time</th>
              <th className="py-2 px-4 border-b border-gray-600">Days</th>
              <th className="py-2 px-4 border-b border-gray-600">Teacher Assigned</th>
              <th className="py-2 px-4 border-b border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr key={classroom._id}>
                <td className="py-2 px-4 border-b border-gray-600">{classroom.name}</td>
                <td className="py-2 px-4 border-b border-gray-600">{classroom.startTime}</td>
                <td className="py-2 px-4 border-b border-gray-600">{classroom.endTime}</td>
                <td className="py-2 px-4 border-b border-gray-600">
                  {classroom.days.join(", ")}
                </td>
                <td className="py-2 px-4 border-b border-gray-600">
                  {classroom.teacherName || "Unassigned"}
                </td>
                <td className="py-2 px-4 border-b border-gray-600">
                  <div className="space-y-2">
                    <div>
                      <select
                        value={classroom.teacherId || ""}
                        onChange={(e) =>
                          handleAssignTeacher(classroom._id, e.target.value)
                        }
                        className="w-full p-1 border border-gray-700 bg-gray-800 text-gray-100 rounded"
                      >
                        <option value="">Assign Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleDeleteClassroom(classroom._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
                    >
                      Delete
                    </button>

                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PrincipalDashboard;
