import React, { useEffect, useState } from "react";
import axios from "axios";

const formatCurrency = (v, l = "en-IN", c = "INR") =>
  new Intl.NumberFormat(l, { style: "currency", currency: c }).format(v);

export default function SnacksCollectorRevenue() {
  const [collectors, setCollectors] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get("http://localhost:8004/snacks-revenue/revenue");
        const data = res.data?.data || [];

        // Calculate total snack revenue from all collectors
        const total = data.reduce(
          (sum, c) => sum + (c.collectorRevenue || 0),
          0
        );

        setCollectors(data);
        setTotalRevenue(total);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">Loading snack revenue...</div>
    );

  return (
    <div className="mx-auto max-w-4xl p-6 text-center">
      {/* 🧾 Top summary */}
      <div className="mb-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 shadow-lg text-white">
        <h2 className="text-2xl font-extrabold mb-2">
          🍿 Total Snack Revenue Collected
        </h2>
        <p className="text-3xl font-bold">
          {formatCurrency(totalRevenue)}
        </p>
        <p className="mt-1 text-sm text-blue-100">
          Across {collectors.length} collectors
        </p>
      </div>

      {/* 📊 Table section */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Collector ID</th>
              <th className="px-4 py-2 border">Collected Revenue</th>
            </tr>
          </thead>
          <tbody>
            {collectors.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-4 text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              collectors.map((collector) => (
                <tr
                  key={collector.collectorId || Math.random()}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border font-medium text-gray-800">
                    {collector.collectorId || "Unassigned"}
                  </td>
                  <td className="px-4 py-2 border font-bold text-green-600">
                    {formatCurrency(collector.collectorRevenue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
