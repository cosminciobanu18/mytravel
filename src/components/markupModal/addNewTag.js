import { CircleSmall } from "lucide-react";
import { useState, useMemo, useRef, useEffect, useTransition } from "react";
import { markerColorsArray } from "@/lib/helpers";
import { Button, Select, SelectItem } from "@heroui/react";

export default function AddNewTagComponent({
  allTags,
  existingTags,
  handleAddExistingTag,
  handleAddNewTag,
}) {
  const [query, setQuery] = useState("");
  const [tagColor, setTagColor] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const formRef = useRef();
  console.log({ isCreating });
  const [isPendingE, startTransitionE] = useTransition();
  const [isPendingC, startTransitionC] = useTransition();

  const filtered = useMemo(() => {
    if (!query) return [];
    return allTags.filter((tag) =>
      tag.name.toLowerCase().startsWith(query.toLowerCase())
    );
  }, [query]);

  const handleSelect = async (tag) => {
    setQuery("");
    setIsFocused(false);
    //daca markupul nu are deja tagul selectat, il adaugam la tagurile markupului
    //adica if !existingTags.contains(await tag.saveToDb() cand e nou || tag cand exista) =>dar el exista
    startTransitionE(async () => {
      await handleAddExistingTag(tag);
    });
  };

  const handleCreateNewTag = async ({ name, color }) => {
    //inca nu l am atribuit la buton
    startTransitionC(async () => {
      await handleAddNewTag({ name, color });
      setIsCreating(false);
      setIsFocused(false);
      setQuery("");
    });
  };

  useEffect(() => {
    const f = (e) => {
      if (!formRef?.current?.contains(e.target)) setIsFocused(false);
    };
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  });

  return (
    <div className="relative w-40 mx-auto mt-4 bg-inherit" ref={formRef}>
      {/* Input */}
      <label htmlFor="new-tag" className="mb-2 block font-semibold text-center">
        Add new tag
      </label>
      <input
        type="text"
        name="new-tag"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full bg-gray-300 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Add tag..."
      />
      {isPendingC && <span>Creating tag...</span>}
      {/* Dropdown */}
      {isFocused && (
        <>
          <div tabIndex={-1} onFocus={() => setIsFocused(true)}>
            {!isCreating ? (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ">
                <>
                  {filtered.length > 0 &&
                    filtered.map((tag) => {
                      const [{ colorInside, colorOutside }] =
                        markerColorsArray.filter((c) => c.name === tag.color);
                      const isDisabled = existingTags.some(
                        (existingTag) => existingTag.name === tag.name
                      );
                      return (
                        <li
                          key={tag._id}
                          // onClick={() => handleSelect(tag)} nu e bun
                        >
                          <button
                            onClick={() => {
                              handleSelect(tag);
                            }}
                            className={`h-full w-full left-0 px-3 py-2 text-start ${
                              !isDisabled && "hover:bg-blue-100"
                            }`}
                            disabled={isDisabled}
                          >
                            <CircleSmall
                              size={12}
                              color={colorOutside}
                              fill={colorInside}
                              className="inline mr-2"
                            />
                            {tag.name}
                          </button>
                        </li>
                      );
                    })}

                  <li className="cursor-pointer px-3 py-2 hover:bg-blue-100">
                    {!isPendingE ? (
                      <button
                        // }}
                        onClick={() => {
                          setIsCreating(true);
                          setIsFocused(true);
                        }}
                      >
                        + Create new tag
                      </button>
                    ) : (
                      <span>Loading...</span>
                    )}
                  </li>
                </>
              </ul>
            ) : (
              <>
                <Select
                  aria-label="Color selection"
                  placeholder="Select a color"
                  className="mt-2"
                  selectedKeys={tagColor}
                  onSelectionChange={setTagColor}
                  renderValue={(items) =>
                    items.map((item) => {
                      console.log(item);
                      return (
                        <div key={item.key}>
                          <CircleSmall
                            size={12}
                            // style={{ stroke: colorOutside, fill: colorInside }}
                            color={item.props.startContent.props.color}
                            fill={item.props.startContent.props.fill}
                            className="inline"
                          />
                          <span>{item.textValue}</span>
                        </div>
                      );
                    })
                  }
                >
                  {markerColorsArray.map((color) => {
                    return (
                      <SelectItem
                        key={color.name}
                        startContent={
                          <CircleSmall
                            size={12}
                            color={color.colorOutside}
                            fill={color.colorInside}
                          />
                        }
                      >
                        {color.name}
                      </SelectItem>
                    );
                  })}
                </Select>
                <div className="flex justify-evenly w-full mt-1">
                  <Button
                    onPress={() => {
                      setIsCreating(false);
                      setIsFocused(false);
                      setTagColor(null);
                    }}
                    color="danger"
                    className="inline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={async () => {
                      const tagName = query;
                      const color = tagColor.currentKey;
                      console.log(tagName, color);
                      await handleCreateNewTag({ name: tagName, color });
                    }}
                    className="inline"
                    size="sm"
                    color="primary"
                  >
                    Create
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
