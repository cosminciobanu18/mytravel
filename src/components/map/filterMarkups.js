"use client";
import { markerColorsArray } from "@/lib/helpers";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Chip } from "@heroui/react";
import { CircleSmall } from "lucide-react";
import { useState } from "react";
export default function FilterMarkupsComponent({
  markers,
  setMarkers,
  selectedTags,
  setSelectedTags,
  tags,
  className,
}) {
  const [selectedTag, setSelectedTag] = useState(null);
  const [query, setQuery] = useState("");
  const filtered =
    query === ""
      ? tags
      : tags.filter((tag) =>
          tag.name.toLowerCase().includes(query.toLocaleLowerCase()),
        );

  const handleSelectTag = (tag) => {
    setSelectedTags((prev) => {
      const awaawa = [...prev, tag];
      return awaawa;
    });
    setSelectedTag(null);
    setQuery("");
  };

  const handleDeselectTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t._id !== tag._id));
  };

  return (
    <div className={`${className} mx-auto w-max max-w-7xl mb-5 px-20`}>
      <div className="flex flex-col items-center w-40 justify-center">
        <h5 className="text-xl font-medium text-center mb-3">Filter by tags</h5>
        <Combobox
          value={selectedTag}
          onChange={(value) => {
            value && handleSelectTag(value);
          }}
          className="mb-4"
        >
          <div className="relative">
            <ComboboxInput
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              displayValue={(tag) => tag?.name}
              className="p-2"
            />
            <div className="absolute z-[1000000] w-full">
              <ComboboxOptions className="max-h-96 overflow-scroll">
                {filtered?.map((tag) => {
                  const [{ colorInside, colorOutside }] =
                    markerColorsArray.filter((c) => c.name === tag.color);
                  const disabled = selectedTags.some((t) => t._id === tag._id);
                  if (disabled) return null;
                  return (
                    <ComboboxOption
                      disabled={disabled}
                      key={tag.name}
                      value={tag}
                      className="cursor-pointer rounded-lg bg-white border-medium w-full text-center p-1 pr-4"
                    >
                      <CircleSmall
                        size={12}
                        color={colorOutside}
                        fill={colorInside}
                        className="inline mr-2"
                      />
                      {tag.name}
                    </ComboboxOption>
                  );
                })}
              </ComboboxOptions>
            </div>
          </div>
        </Combobox>
        <div className="flex gap-2">
          {selectedTags.length > 0 &&
            selectedTags?.map((tag) => (
              <Chip
                key={tag._id}
                onClose={() => handleDeselectTag(tag)}
                className="px-2 py-1"
                startContent={
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag?.color }}
                  />
                }
              >
                <div className="flex">
                  <span className="inline">{tag?.name}</span>
                </div>
              </Chip>
            ))}
        </div>
      </div>
    </div>
  );
}
