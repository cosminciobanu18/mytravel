"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";

const presetColors = [
  "#f87171", // red
  "#60a5fa", // blue
  "#34d399", // green
  "#fbbf24", // yellow
  "#a78bfa", // purple
];

export default function GptModal() {
  const [tags, setTags] = useState([
    { id: "1", name: "Urgent", color: "#f87171" },
    { id: "2", name: "In Progress", color: "#60a5fa" },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(presetColors[0]);

  const addTag = () => {
    if (!newName.trim()) return;
    setTags([
      ...tags,
      { id: crypto.randomUUID(), name: newName, color: newColor },
    ]);
    setNewName("");
    setNewColor(presetColors[0]);
    setIsOpen(false);
  };

  const deleteTag = (id) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Tag List */}
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((tag) => (
          <Chip
            key={tag.id}
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
        {/* <Button
          className="mx-auto font-semibold"
          color="default"
          variant="shadow"
          onPress={() => setIsOpen(true)}
        >
          + Add Tag
        </Button> */}
      </div>

      {/* Add Tag Button */}

      {/* Modal for Adding Tag */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} className="z-[100006]">
        <ModalContent>
          <ModalHeader>Add a Tag</ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Tag Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Design, Bugfix..."
            />

            <Select
              label="Color"
              selectedKeys={[newColor]}
              onSelectionChange={(keys) => setNewColor(Array.from(keys)[0])}
            >
              {presetColors.map((c) => (
                <SelectItem
                  key={c}
                  startContent={
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: c }}
                    />
                  }
                >
                  {c}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={addTag}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
