import { useRef, useState } from "react";
import { CircleSmall, X } from "lucide-react";
import { Button, Divider, ListboxItem, Listbox, Chip } from "@heroui/react";
import ReactDOM from "react-dom";
import { markerColorsArray } from "@/lib/helpers";
import GptModal from "./gptModal";
import AddNewTagComponent from "./addNewTag";
export default function MarkupEditModal({
  isOpen,
  setIsModalOpen,
  onDelete,
  //   existingTags,
  location,
}) {
  if (!isOpen) return null;
  const [tags, setTags] = useState([
    //vom inlocui cu fetchAllTags
    { _id: 1, color: "red", name: "Important" },
    { _id: 2, color: "blue", name: "Albastrea" },
    { _id: 3, color: "gold", name: "Smecherie" },
    { _id: 4, color: "red", name: "KFC" },
  ]);
  const [existingTags, setExistingTags] = useState([
    //vor fi cele date ca parametru acestei componente MarkupEditModal
    { _id: 3, color: "gold", name: "Smecherie" },
    { _id: 4, color: "red", name: "KFC" },
  ]);
  const ref = useRef();

  //   useEffect(() => {
  //     const handleClick = (e) => {
  //       if (!ref.current.contains(e.target)) {
  //         setIsModalOpen(false);
  //       }
  //     };
  //   });

  return ReactDOM.createPortal(
    <>
      <div //modal overlay
        className={`fixed inset-0 w-full h-full backdrop-blur-sm bg-white-50/40 z-[10001] ${
          isOpen ? "" : "hidden"
        }`}
        onClick={(e) => {
          //   if (!ref.current.contains(e.target)) {
          setIsModalOpen(false);
          //   }
        }}
      ></div>
      <div className="fixed flex items-center justify-center border-green-400 border-2 backdrop-blur-sm bg-green-50/90 w-[600px] min-h-[400px] z-[10002] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div
          ref={ref}
          className="bg-green-50/40 p-6 shadow-xl w-full h-full z-[10002]"
        >
          <button
            className="absolute top-6 right-6"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-4 text-green-900/50">
              Location
            </h3>
            <h3 className="text-4xl font-bold mb-3">{location.name}</h3>
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
                {tags.map((tag) => (
                  <Chip
                    key={tag._id}
                    onClose={() => deleteTag(tag.id)}
                    className="px-2 py-1"
                    startContent={
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                    }
                  >
                    {tag.name}
                  </Chip>
                ))}
              </div>
            </div>
            <AddNewTagComponent
              tags={tags}
              locationId={location._id}
              existingTags={existingTags}
            />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
