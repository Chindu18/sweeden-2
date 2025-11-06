"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BASE_URL = "http://localhost:8004/collectors";

interface Collector {
  _id: string;
  name: string;
  description: string;
}

export default function CollectorManager() {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCollectors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getcollectors`);
      setCollectors(res.data.collectors || []);
    } catch (err) {
      console.error("Error fetching collectors", err);
      setCollectors([]);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Name is required");

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/updatecollector/${editingId}`, {
          name,
          description,
        });
        alert("Collector updated successfully");
      } else {
        await axios.post(`${BASE_URL}/addcollectors`, { name, description });
        alert("Collector added successfully");
      }

      setName("");
      setDescription("");
      setEditingId(null);
      fetchCollectors();
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collector?")) return;
    try {
      await axios.delete(`${BASE_URL}/deletecollector/${id}`);
      alert("Collector deleted successfully");
      fetchCollectors();
    } catch {
      alert("Error deleting collector");
    }
  };

  const handleEdit = (collector: Collector) => {
    setName(collector.name);
    setDescription(collector.description);
    setEditingId(collector._id);
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Add / Edit Collector Card */}
      <Card className="max-w-md mx-auto shadow-lg border border-gray-200 rounded-3xl transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-700">
            {editingId ? "Edit Collector" : "Add Collector"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Collector Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border-gray-300 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl border-gray-300 focus:ring-blue-400 focus:border-blue-400 transition"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-md px-4 py-2 transition-transform transform hover:scale-105"
            >
              {editingId ? "Update" : "Add"}
            </Button>

            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setDescription("");
                }}
                className="rounded-xl border-gray-400 hover:bg-gray-100 text-gray-700 px-4 py-2 transition"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Collector List */}
      <div className="grid gap-4 max-w-lg mx-auto">
        {collectors.length === 0 ? (
          <p className="text-center text-gray-500 italic">No collectors found. Add one above.</p>
        ) : (
          collectors.map((c) => (
            <Card
              key={c._id}
              className="shadow-lg border border-gray-200 rounded-3xl transform transition-all hover:scale-105 hover:shadow-2xl duration-300"
            >
              <CardContent className="flex justify-between items-center py-4 px-5">
                <div>
                  <p className="font-bold text-lg text-indigo-600">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-xl px-3 py-2 transition-transform transform hover:scale-105"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-3 py-2 transition-transform transform hover:scale-105"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
