"use client";
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("@/components/map/leafletMap"), {
  ssr: false,
});
import FilterMarkupsComponent from "@/components/map/filterMarkups";
import { Divider, Input, Listbox, ListboxItem } from "@heroui/react";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import {
  addTagToMarkupId,
  createTag,
  searchLocation,
  deleteTagFromMarkupId,
  moveTagUp,
  deleteMarkupById,
} from "@/lib/actions/actions";
import MarkupEditModal from "@/components/markupModal/markupEditModal";
import { toast } from "react-toastify";

export default function MapComponent({ pins, tags }) {
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [markers, setMarkers] = useState(pins);
  const [allTags, setAllTags] = useState(tags);
  const [tempMarker, setTempMarker] = useState(null);
  const [viewCenter, setViewCenter] = useState([47.15, 27.58]);
  const [isPending, startTransition] = useTransition();

  const [selectedTags, setSelectedTags] = useState([]);
  const filtered =
    selectedTags.length === 0
      ? markers
      : markers.filter((mark) =>
          mark?.tags.some((tag) => selectedTags.some((t) => t._id === tag._id)),
        );

  const fetchSearchInput = async (query) => {
    const response = await fetch(`/api/search/${query}`);
    if (!response.ok) {
      setError(response.error);
      setSearchResults(null);
      return;
    }
    const result = await response.json();
    setError(null);
    setSearchResults(result);
  };

  const handleClickSearchResult = (loc) => {
    if (loc === null) {
      setTempMarker(null);
      return;
    }
    if (!markers.some((marker) => marker.location.place_id === loc.place_id))
      setTempMarker({
        location: {
          place_id: loc.place_id,
          name: loc.name,
          address: loc.display_name,
          type: loc.type,
          latlon: [loc.lat, loc.lon],
          country: loc.address.country,
          city: loc.address?.city || loc.address?.town || loc.address?.village,
        },
        tags: [],
      });
    setViewCenter([loc.lat, loc.lon]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      const formdata = new FormData(e.currentTarget);
      const query = formdata.get("query");
      if (!query || !query.trim()) {
        setTempMarker(null);
        setSearchResults(null);
      } else {
        await fetchSearchInput(query);
      }
    });
  };

  const handleClearSearch = (e) => {
    e.preventDefault();
    setTempMarker(null);
    setSearchResults(null);
    setError(null);
  };

  //modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLocation, setModalLocation] = useState(null);
  const [modalTags, setModalTags] = useState([]);
  const [modalMarkupId, setModalMarkupId] = useState(null);

  const addTagToState = (newTag) => {
    setModalTags((prev) => [...prev, newTag]);
    setMarkers((prev) =>
      prev.map((mark) => {
        if (mark._id === modalMarkupId)
          return {
            ...mark,
            tags: [...mark.tags, newTag],
          };
        else return mark;
      }),
    );
  };

  const handleAddExistingTag = async (tag) => {
    const tagsBackup = modalTags;
    const markersBackup = markers;
    addTagToState(tag);
    try {
      const modifiedMarkup = await addTagToMarkupId(tag, modalMarkupId);
      if (modifiedMarkup?.error) throw modifiedMarkup.error;
    } catch (error) {
      console.warn("Error adding existing tag to markup", error);
      setMarkers(markersBackup);
      setModalTags(tagsBackup);
    }
  };

  const handleAddNewTag = async (tag) => {
    const newTag = await createTag(tag);
    if (newTag?.error) {
      toast.error("Error creating tag", { position: "bottom-center" });
      console.warn(newTag);
      return;
    }
    setAllTags((prev) => [...prev, newTag]);
    await handleAddExistingTag(newTag);
  };

  const handleDeleteTag = async (tagId) => {
    const markersBackup = markers;
    const tagsBackup = modalTags;
    setModalTags((prev) => {
      const newModalTags = prev.filter((t) => t._id !== tagId);
      setMarkers((prev) =>
        prev.map((mark) =>
          mark._id === modalMarkupId ? { ...mark, tags: newModalTags } : mark,
        ),
      );
      return newModalTags;
    });
    try {
      await deleteTagFromMarkupId(tagId, modalMarkupId);
      toast.success("Tag deleted successfully", { position: "bottom-center" });
    } catch (e) {
      setMarkers(markersBackup);
      setModalTags(tagsBackup);
      toast.error("Error deleting tag", { position: "bottom-right" });
      console.warn("Error deleting tag", e);
    }
  };

  const handleMoveTagUp = async (tagId) => {
    const markersBackup = markers;
    const tagsBackup = modalTags;
    setModalTags((prev) => {
      const newModalTags = [...prev];
      const index = modalTags.map((tag) => tag._id === tagId).indexOf(true);
      if (index > 0 && index < modalTags.length) {
        [newModalTags[index - 1], newModalTags[index]] = [
          newModalTags[index],
          newModalTags[index - 1],
        ];
      }
      setMarkers((pv) =>
        pv.map((mark) =>
          mark._id === modalMarkupId ? { ...mark, tags: newModalTags } : mark,
        ),
      );
      return newModalTags;
    });
    try {
      await moveTagUp(tagId, modalMarkupId);
    } catch (e) {
      setMarkers(markersBackup);
      setModalTags(tagsBackup);
      toast.error("Error moving tag", { position: "bottom-left" });
      console.warn("Eroare:", e);
    }
  };

  const handleDeleteOpenedMarkup = async () => {
    if (!confirm("Delete this markup? This action is permanent!")) return;
    const markupsBackup = markers;
    const deletedId = modalMarkupId;
    setMarkers((prev) => prev.filter((mark) => mark._id !== modalMarkupId));
    setModalMarkupId(null);
    try {
      setIsModalOpen(false);
      await deleteMarkupById(deletedId);
      toast.success("Markup deleted successfully", { position: "top-center" });
    } catch (e) {
      setMarkers(markupsBackup);
      toast.error("Error deleting markup", { position: "top-center" });
      console.error("Eroare", e);
    }
  };

  return (
    <>
      <MarkupEditModal
        isOpen={isModalOpen}
        location={modalLocation}
        existingTags={modalTags}
        setIsModalOpen={setIsModalOpen}
        handleAddExistingTag={handleAddExistingTag}
        handleAddNewTag={handleAddNewTag}
        allTags={allTags}
        handleDeleteTag={handleDeleteTag}
        handleMoveTagUp={handleMoveTagUp}
        handleDeleteOpenedMarkup={handleDeleteOpenedMarkup}
      />
      <FilterMarkupsComponent
        markers={markers}
        setMarkers={setMarkers}
        tags={allTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        className=""
      />
      <div className="max-w-7xl relative mx-auto">
        <div className="absolute top-6 left-6 w-60 z-[10000] bg-white p-3">
          <form className="relative" onSubmit={handleSubmit}>
            <Input
              type="text"
              variant="bordered"
              fullWidth
              placeholder="Search a place..."
              className="rounded-xl"
              name="query"
            />

            {!searchResults ? (
              <button className="absolute right-3 top-3" type="submit">
                <Search size={18} className="text-gray-600" />
              </button>
            ) : (
              <button
                className="absolute right-3 top-3"
                onClick={handleClearSearch}
                type="reset"
              >
                <X size={18} className="text-gray-600" />
              </button>
            )}
            {(isPending || searchResults || error) && (
              <Divider className="mt-4" />
            )}
            {isPending && <div className="w-full p-4">Loading...</div>}
            {error ?? null}
            {!isPending && searchResults && !error && (
              <Listbox className="max-h-[600px] overflow-scroll">
                {searchResults?.map((loc) => (
                  <ListboxItem
                    className="mt-4"
                    key={loc.place_id}
                    onPress={() => handleClickSearchResult(loc)}
                  >
                    <h4 className="text-lg font-bold">{loc.name}</h4>
                    <h6 className="text-md font-semibold">
                      {loc.address?.city ||
                        loc.address?.town ||
                        loc.address?.village}
                      {", "}
                      {loc.address.country}
                    </h6>
                    <p className="text-sm font-medium">{loc.type}</p>
                  </ListboxItem>
                ))}
              </Listbox>
            )}
          </form>
        </div>
        <div className="w-full flex justify-center">
          <LeafletMap
            filtered={filtered}
            selectedTags={selectedTags}
            setMarkers={setMarkers}
            tempMarker={tempMarker}
            setTempMarker={setTempMarker}
            viewCenter={viewCenter}
            setModalLocation={setModalLocation}
            setModalTags={setModalTags}
            setIsModalOpen={setIsModalOpen}
            setModalMarkupId={setModalMarkupId}
          />
        </div>
      </div>
    </>
  );
}
