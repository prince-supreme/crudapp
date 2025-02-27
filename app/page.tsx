"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react"; 

interface User {
  id: number;
  name: string;
}
export default function Home() {
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); 
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      } catch (err) {
        setAlert({ type: "error", message: "Failed to fetch users!" });
        throw err; 
      }
    },
  });
  
  const API_URL = "https://jsonplaceholder.typicode.com/users";

const addUserMutation = useMutation({
  mutationFn: async (newUser: User) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to add user");

    return data as User;
  },
  onSuccess: (newUser) => {
    setAlert({ type: "success", message: "User added successfully!" });

    queryClient.setQueryData<User[]>(["users"], (oldUsers = []) => [
      ...oldUsers,
      { ...newUser, id: Date.now() }, // Assigning a temporary unique ID
    ]);

    setIsAddUserModalOpen(false);
    setNewUserName("");
  },
  onError: (error: unknown) => {
    console.error("Add User Error:", error);
    setAlert({ type: "error", message: "Failed to add user!" });
  },
});

const updateUserMutation = useMutation({
  mutationFn: async (updatedUser: User) => {
    if (updatedUser.id > 10) { 
      return updatedUser;
    }
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });
      if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  },
  onSuccess: (updatedUser) => {
    setAlert({ type: "success", message: "User updated successfully!" });
    queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) =>
      oldUsers ? oldUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)) : []
    );
    setEditUser(null);
    setNewUserName("");
  },
  onError: () => setAlert({ type: "error", message: "Failed to update user!" }),
});

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
    },
    onSuccess: (_, userId) => {
      setAlert({ type: "success", message: "User deleted successfully!" });
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) =>
        oldUsers ? oldUsers.filter((user) => user.id !== userId) : []
      );
      setDeleteUserId(null);
    },
    onError: () => setAlert({ type: "error", message: "Failed to delete user!" }),
  });

  const handleAddUser = () => {
    if (!newUserName.trim()) {
      setAlert({ type: "error", message: "User name cannot be empty!" });
      return;
    }
    addUserMutation.mutate({ id: Date.now(), name: newUserName });
  };
  const handleUpdateUser = () => {
    if (!editUser?.name?.trim()) {
      setAlert({ type: "error", message: "User name cannot be empty!" });
      return;
    }
    updateUserMutation.mutate(editUser);
  };
  
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-blue-700">Candidate List:</h2>
      <button 
        onClick={() => setIsAddUserModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Add User
      </button>
      </div>

      {alert && (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4">
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-md shadow-lg transition-all duration-300 
                      ${alert.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          <span>{alert.message}</span>
          <button 
            onClick={() => setAlert(null)}
            className="ml-auto text-lg font-bold hover:text-gray-300 transition"
          >
            &times;
          </button>
        </div>
      </div>
    )}


      {isLoading && <p className="text-gray-500 italic">Loading users...</p>}
      {error && <p className="text-red-600 font-medium">Error fetching users!</p>}


      <ul className="space-y-3">
  {users?.map((user) => (
    <li 
      key={user.id} 
      className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center"
    >
      <span className="text-gray-900 font-medium">{user.name}</span>
      <div className="flex gap-x-2">
        <button 
          onClick={() => setEditUser(user)} 
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-all"
        >
          ✏ Edit
        </button>
        <button 
          onClick={() => setDeleteUserId(user.id)} 
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
        >
          🗑 Delete
        </button>
      </div>
    </li>
  ))}
</ul>

      {isAddUserModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-bold">Add New User</h2>
            <input
              type="text"
              placeholder="Enter user name"
              className="input input-bordered w-full mb-2"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <div className="modal-action">
              <button onClick={handleAddUser} className="btn btn-success">Save</button>
              <button onClick={() => setIsAddUserModalOpen(false)} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

{editUser && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
      <input
        type="text"
        className="input input-bordered w-full mt-3 p-2 border border-gray-300 rounded-md"
        value={editUser.name}
        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
      />
      <div className="flex justify-end gap-x-3 mt-4">
        <button onClick={handleUpdateUser} className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition">Save</button>
        <button onClick={() => setEditUser(null)} className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500 transition">Cancel</button>
      </div>
    </div>
  </div>
)}

{deleteUserId && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
      <p className="text-gray-700 mt-2">Are you sure you want to delete this user?</p>
      <div className="flex justify-end gap-x-3 mt-4">
        <button onClick={() => deleteUserMutation.mutate(deleteUserId)} className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition">Yes, Delete</button>
        <button onClick={() => setDeleteUserId(null)} className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500 transition">Cancel</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
