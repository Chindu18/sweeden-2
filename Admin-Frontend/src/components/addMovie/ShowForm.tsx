"use client";
import React from "react";

export interface ShowPrices {
  adult: string;
  kids: string;
}

export interface CollectorPrice {
  collectorName: string;
  adult: string;
  kids: string;
}

export interface ShowType {
  date: string;
  time: string;
  prices: {
    online: ShowPrices;
    videoSpeed: ShowPrices;
  };
  collectors: CollectorPrice[];
  blockedSeats: number[];
  isNew?: boolean; // mark new shows
}

interface ShowFormProps {
  show: ShowType;
  index: number;
  onChange: (
    index: number,
    field: "date" | "time" | "prices" | "collectors" | "blockedSeats",
    subField?: "adult" | "kids" | "collectorName",
    collectorIndex?: number,
    value?: string | number[]
  ) => void;
  onAddCollector: (index: number) => void;
  onRemoveCollector: (showIndex: number, collectorIndex: number) => void;
  readOnly?: boolean; // lock old shows
}

export const ShowForm: React.FC<ShowFormProps> = ({
  show,
  index,
  onChange,
  onAddCollector,
  onRemoveCollector,
  readOnly = false,
}) => {
  const inputClass = `border p-2 w-full rounded ${readOnly ? "bg-gray-200 cursor-not-allowed" : ""}`;

  return (
    <div className={`border p-3 rounded mb-3 space-y-2 ${readOnly ? "opacity-70" : ""}`}>
      {/* Date & Time */}
      <input
        type="date"
        value={show.date}
        onChange={e => onChange(index, "date", undefined, undefined, e.target.value)}
        className={inputClass}
        readOnly={readOnly}
        required
      />
      <input
        type="time"
        value={show.time}
        onChange={e => onChange(index, "time", undefined, undefined, e.target.value)}
        className={inputClass}
        readOnly={readOnly}
        required
      />

      {/* Prices */}
      <div className="grid grid-cols-2 gap-2">
        {(["online", "videoSpeed"] as const).map((method, idx) => (
          <div key={method} className="border p-2 rounded space-y-1">
            <p className="font-medium capitalize">{method}</p>
            <input
              type="text"
              placeholder="Adult Price"
              value={show.prices[method].adult}
              onChange={e => onChange(index, "prices", "adult", idx, e.target.value)}
              className={inputClass}
              readOnly={readOnly}
              required
            />
            <input
              type="text"
              placeholder="extra Price"
              value={show.prices[method].kids}
              onChange={e => onChange(index, "prices", "kids", idx, e.target.value)}
              className={inputClass}
              readOnly={readOnly}
              required
            />
          </div>
        ))}
      </div>

      {/* Collectors */}
      <div className="mt-2">
        {show.collectors.map((collector, cIndex) => (
          <div key={cIndex} className="border p-2 rounded mb-2 space-y-1">
            <input
              type="text"
              placeholder="Collector Name"
              value={collector.collectorName}
              onChange={e => onChange(index, "collectors", "collectorName", cIndex, e.target.value)}
              className={inputClass}
              readOnly={readOnly}
              required
            />
            <input
              type="text"
              placeholder="Adult Price"
              value={collector.adult}
              onChange={e => onChange(index, "collectors", "adult", cIndex, e.target.value)}
              className={inputClass}
              readOnly={readOnly}
              required
            />
            <input
              type="text"
              placeholder="extra Price"
              value={collector.kids}
              onChange={e => onChange(index, "collectors", "kids", cIndex, e.target.value)}
              className={inputClass}
              readOnly={readOnly}
              required
            />
            {!readOnly && (
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded mt-1"
                onClick={() => onRemoveCollector(index, cIndex)}
              >
                Remove Collector
              </button>
            )}
          </div>
        ))}

        {!readOnly && (
          <button
            type="button"
            className="bg-gray-300 text-black px-2 py-1 rounded mt-1"
            onClick={() => onAddCollector(index)}
          >
            + Add Collector
          </button>
        )}
      </div>
    </div>
  );
};
