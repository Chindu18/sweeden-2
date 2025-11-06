"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CampaignToggle() {
  const [notifyLeads, setNotifyLeads] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const backend_url = "http://localhost:8004";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${backend_url}/campaignmail/status`);
        setNotifyLeads(res.data?.notifyLeads ?? false);
      } catch (err) {
        console.error("Failed to fetch campaign status:", err);
        setNotifyLeads(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleToggle = async () => {
    try {
      const newState = !notifyLeads;
      setNotifyLeads(newState); // instant UI feedback
      await axios.put(`${backend_url}/campaignmail/update`, { notifyLeads: newState });
    } catch (err) {
      console.error("Failed to update campaign status:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-slate-300 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300">Loading campaign status...</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border border-slate-300 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-4">🎯 Campaign Notifications</h2>
      <label className="flex items-center gap-3 cursor-pointer">
        <span className="text-slate-800 dark:text-white">Notify Leads</span>
        <input
          type="checkbox"
          checked={!!notifyLeads}
          onChange={handleToggle}
          className="w-5 h-5 accent-slate-900 dark:accent-white"
        />
      </label>
    </div>
  );
}