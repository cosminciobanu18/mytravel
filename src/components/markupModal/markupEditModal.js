import { useRef, useState } from "react";
import { CircleSmall, X, ArrowUpCircle, Trash, Trash2 } from "lucide-react";
import { Divider, Chip } from "@heroui/react";
import ReactDOM from "react-dom";
import { markerColorsArray } from "@/lib/helpers";
import AddNewTagComponent from "./addNewTag";
export default function MarkupEditModal({
  isOpen,
  setIsModalOpen,
  handleDeleteTag,
  handleDeleteOpenedMarkup,
  existingTags,
  location,
  handleAddExistingTag,
  handleAddNewTag,
  handleMoveTagUp,
  allTags,
}) {
  const ref = useRef();
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div //modal overlay
        className={`fixed inset-0 w-full h-full backdrop-blur-sm bg-white-50/40 z-[10001] ${
          isOpen ? "" : "hidden"
        }`}
        onClick={(e) => {
          setIsModalOpen(false);
        }}
      ></div>
      <div className="fixed flex items-center justify-center border-green-400 border-2 backdrop-blur-sm bg-green-50/90 w-[600px] min-h-[400px] z-[10002] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div
          ref={ref}
          className="bg-green-50/40 p-6 shadow-xl w-full h-full z-[10002]"
        >
          <div className="absolute top-6 right-6 flex justify-between gap-x-8">
            <button className="text-red-600" onClick={handleDeleteOpenedMarkup}>
              <Trash2 size={20} />
            </button>
            <button onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-4 text-green-900/50">
              Location
            </h3>
            <h3 className="text-4xl font-bold mb-3 text-center">
              {location.name}
            </h3>
            <h5 className="text-2xl font-semibold mb-2">
              {location.city}, {location.country}
            </h5>
            <h6 className="text-xl mb-10">{location.type}</h6>
            <Divider />
            <h3 className="text-2xl font-semibold mt-3 text-green-900/50 mb-4">
              Tags
            </h3>
            <div className="space-y-4 mt-4">
              {/* Tag List */}
              <div className="flex flex-wrap gap-2 items-center">
                {existingTags?.map((tag) => {
                  console.log({ existingTags });
                  return (
                    <Chip
                      key={tag._id}
                      onClose={() => handleDeleteTag(tag._id)}
                      className="px-2 py-1"
                      startContent={
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                      }
                    >
                      <div className="flex">
                        <span className="inline">{tag.name}</span>
                        <button
                          className="inline ml-1"
                          onClick={() => handleMoveTagUp(tag._id)}
                        >
                          <ArrowUpCircle size={18} fill="#6FCFEE" />
                        </button>
                      </div>
                    </Chip>
                  );
                })}
              </div>
            </div>
            <AddNewTagComponent
              allTags={allTags}
              // locationId={location._id}
              existingTags={existingTags}
              handleAddExistingTag={handleAddExistingTag}
              handleAddNewTag={handleAddNewTag}
            />
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
