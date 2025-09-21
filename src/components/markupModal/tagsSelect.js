import { Select, SelectItem } from "@heroui/react";
import { CircleSmall } from "lucide-react";
import { markerColorsArray } from "@/lib/helpers";
export default function TagsSelectComponent({ tags }) {
  return (
    <Select label="Tags" placeholder="Choose tags" selectionMode="multiple">
      {tags?.map((tag) => {
        const [{ colorInside, colorOutside }] = markerColorsArray.filter(
          (c) => c.name === tag.color
        );
        return (
          <SelectItem
            key={`${tag.name}`}
            startContent={
              <CircleSmall
                size={12}
                // style={{ stroke: colorOutside, fill: colorInside }}
                color={colorOutside}
                fill={colorInside}
              />
            }
          >
            {tag.name}
          </SelectItem>
        );
      })}
    </Select>
  );
}
