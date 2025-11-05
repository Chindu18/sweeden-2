
"use client";
import React, { useState } from "react";
import axios from "axios";
import { ShowForm, ShowType } from "./ShowForm";

interface MovieData {
  title: string;
  cast: {
    actor: string;
    actress: string;
    villan: string;
    supporting: string;
  };
  crew: {
    director: string;
    producer: string;
    musicDirector: string;
    cinematographer: string;
  };
  posters: string[];
  trailer: string;
  shows: ShowType[];
  _id?: string;
}

interface AddMovieFormProps {
  backendUrl: string;
  onSaved: () => void;
  moviePosition: 1 | 2 | 3;
  movieData?: MovieData; // for editing
}

interface FormDataType {
  title: string;
  cast: {
    actor: string;
    actress: string;
    villan: string;
    supporting: string;
  };
  crew: {
    director: string;
    producer: string;
    musicDirector: string;
    cinematographer: string;
  };
  posters: File[];
  trailer: string;
  shows: (ShowType & { isNew?: boolean })[]; // mark new shows
}

// ---------- UI helpers (consistent, bolder, modern) ----------
const Label: React.FC<React.PropsWithChildren<{ htmlFor?: string }>> = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-semibold leading-6 text-slate-900 dark:text-white"
  >
    {children}
  </label>
);

const TextInput = (
  props: React.InputHTMLAttributes<HTMLInputElement> & { dense?: boolean }
) => (
  <input
    {...props}
    className={[
      "mt-1 w-full rounded-xl border border-slate-300 bg-white/90 px-4",
      props.dense ? "py-2.5" : "py-3.5",
      "text-slate-900 placeholder-slate-400 shadow-sm",
      "focus:outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-400",
      "dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-400 dark:border-slate-700 dark:focus:ring-white/10",
      props.className || "",
    ].join(" ")}
  />
);

const Section: React.FC<React.PropsWithChildren<{ title: string; subtitle?: string }>> = ({
  title,
  subtitle,
  children,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
    <div className="mb-4">
      <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </section>
);

export const AddMovieForm: React.FC<AddMovieFormProps> = ({
  backendUrl,
  onSaved,
  moviePosition,
  movieData,
}) => {
  const isEdit = !!movieData;

  const [formData, setFormData] = useState<FormDataType>({
    title: movieData?.title || "",
    cast: movieData?.cast || {
      actor: "",
      actress: "",
      villan: "",
      supporting: "",
    },
    crew: movieData?.crew || {
      director: "",
      producer: "",
      musicDirector: "",
      cinematographer: "",
    },
    posters: [],
    trailer: movieData?.trailer || "",
    shows:
      movieData?.shows.map((show) => ({ ...show, isNew: false })) || [],
  });

  const [posterPreviews, setPosterPreviews] = useState<string[]>(
    movieData?.posters || []
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: keyof FormDataType,
    key?: string
  ) => {
    const { value, name } = e.target;
    if (section && key) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...(prev[section] as Record<string, string>), [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name as keyof FormDataType]: value as any }));
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setFormData((prev) => ({ ...prev, posters: files }));
    setPosterPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleShowChange = (
    index: number,
    field: "date" | "time" | "prices" | "collectors" | "blockedSeats",
    subField?: "adult" | "kids" | "collectorName",
    collectorIndex?: number,
    value?: string | number[]
  ) => {
    setFormData((prev) => {
      const shows = [...prev.shows];
      const show = { ...shows[index] };

      if (!show.isNew) return prev; // lock old shows

      if (field === "blockedSeats") show.blockedSeats = value as number[];
      else if (field === "collectors" && collectorIndex !== undefined && subField) {
        show.collectors[collectorIndex][subField] = value as string;
      } else if (field === "prices" && collectorIndex !== undefined && subField) {
        const priceKey = collectorIndex === 0 ? "online" : "videoSpeed";
        (show.prices as any)[priceKey][subField] = value as string;
      } else (show as any)[field] = value;

      shows[index] = show;
      return { ...prev, shows };
    });
  };

  const addShow = () => {
    setFormData((prev) => ({
      ...prev,
      shows: [
        ...prev.shows,
        {
          date: "",
          time: "",
          prices: { online: { adult: "", kids: "" }, videoSpeed: { adult: "", kids: "" } },
          collectors: [],
          blockedSeats: [],
          isNew: true,
        },
      ],
    }));
  };

  const addCollector = (showIndex: number) => {
    setFormData((prev) => {
      const shows = [...prev.shows];
      if (!shows[showIndex].isNew) return prev;
      shows[showIndex].collectors.push({ collectorName: "", adult: "", kids: "" });
      return { ...prev, shows };
    });
  };

  const removeCollector = (showIndex: number, collectorIndex: number) => {
    setFormData((prev) => {
      const shows = [...prev.shows];
      if (!shows[showIndex].isNew) return prev;
      shows[showIndex].collectors.splice(collectorIndex, 1);
      return { ...prev, shows };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);

      data.append("hero", formData.cast.actor);
      data.append("heroine", formData.cast.actress);
      data.append("villain", formData.cast.villan);
      data.append("supportArtists", formData.cast.supporting);

      data.append("director", formData.crew.director);
      data.append("producer", formData.crew.producer);
      data.append("musicDirector", formData.crew.musicDirector);
      data.append("cinematographer", formData.crew.cinematographer);

      data.append("trailer", formData.trailer);
      data.append("showTimings", JSON.stringify(formData.shows));
      data.append("moviePosition", moviePosition.toString());

      formData.posters.forEach((file) => data.append("photos", file));

      if (isEdit && movieData?._id) {
        await axios.put(`${backendUrl}/api/update/${movieData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Movie updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/addDetails`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Movie saved successfully!");
      }

      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-10 max-w-5xl space-y-6 rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isEdit ? "Edit Movie" : "Add New Movie"}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Fill the details below. Old shows are locked; new shows are editable.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Save Movie"}
        </button>
      </div>

      {/* Title */}
      <Section title="Title">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title">Movie Title</Label>
            <TextInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., The Great Adventure"
              required
              disabled={isEdit}
            />
          </div>
        </div>
      </Section>

      {/* Cast */}
      <Section title="Cast" subtitle="Stronger typography + better spacing">
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.keys(formData.cast).map((role) => (
            <div key={role}>
              <Label htmlFor={`cast-${role}`}>{role}</Label>
              <TextInput
                id={`cast-${role}`}
                type="text"
                placeholder={role}
                value={(formData.cast as any)[role]}
                onChange={(e) => handleChange(e, "cast", role)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Crew */}
      <Section title="Crew">
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.keys(formData.crew).map((role) => (
            <div key={role}>
              <Label htmlFor={`crew-${role}`}>{role}</Label>
              <TextInput
                id={`crew-${role}`}
                type="text"
                placeholder={role}
                value={(formData.crew as any)[role]}
                onChange={(e) => handleChange(e, "crew", role)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Trailer */}
      <Section title="Trailer">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="trailer">Trailer URL</Label>
            <TextInput
              id="trailer"
              type="url"
              name="trailer"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.trailer}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, trailer: e.target.value }))
              }
            />
          </div>
          {formData.trailer && (
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
              <iframe
                src={formData.trailer.replace("watch?v=", "embed/")}
                title="Trailer"
                className="aspect-video w-full"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </Section>

      {/* Posters */}
      <Section title="Posters" subtitle="Up to 3 images">
        <div className="grid gap-3">
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
            <input
              id="posters"
              type="file"
              multiple
              accept="image/*"
              onChange={handlePosterUpload}
              className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-slate-800 dark:text-slate-300 dark:file:bg-white dark:file:text-slate-900 dark:hover:file:bg-slate-100"
            />
          </div>
          {!!posterPreviews.length && (
            <div className="grid grid-cols-3 gap-3">
              {posterPreviews.map((src, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800"
                >
                  <img src={src} className="aspect-[1/1] w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Shows */}
      <Section title="Shows" subtitle="Add new shows; old ones stay read-only">
        <div className="space-y-4">
          {formData.shows.map((show, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Show #{idx + 1} {show.isNew ? "• New" : "• Locked"}
                </p>
              </div>
              <ShowForm
                show={show}
                index={idx}
                onChange={handleShowChange}
                onAddCollector={addCollector}
                onRemoveCollector={removeCollector}
                readOnly={!show.isNew}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addShow}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            + Add New Show
          </button>
        </div>
      </Section>

      {/* Footer actions */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          disabled={loading}
        >
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Save Movie"}
        </button>
      </div>
    </form>
  );
};