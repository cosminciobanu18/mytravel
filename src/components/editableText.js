import { Edit, Check } from "lucide-react";
import { useState } from "react";

const sizes = {
  sm: "lg",
  md: "xl",
  lg: "3xl",
};

export default function EditableTextWrapper({
  label,
  value,
  onSave,
  size,
  className,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  const handleSave = () => {
    setIsEditing(false);
    if (draft !== value) onSave(draft);
  };

  return (
    <div className={`group relative flex flex-col justify-center ${className}`}>
      <span className="font-medium text-lg">{label}</span>
      <br />

      {isEditing ? (
        <form onSubmit={handleSave} className="">
          <input
            className={`border px-2 py-1 bg-inherit rounded text-inherit text-${sizes[size]}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
          <button type="submit" className="ml-2 align-middle  text-green-500">
            <Check size={40} /> Save
          </button>
        </form>
      ) : (
        <div className="inline-block">
          <span className={`text-${sizes[size]}`}>{value}</span>
          <button
            className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit
          </button>
        </div>
      )}
    </div>
  );
}
