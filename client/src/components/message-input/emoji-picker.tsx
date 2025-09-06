import { EMOJI } from "@/constants";

export const EmojiPicker = ({
  onSelect,
}: {
  onSelect: (icon: string) => void;
}) => {
  return (
    <div className="shrink-0">
      <h3 className="px-4 py-2 font-medium text-md text-gray-700">Emoji</h3>

      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-2">
          {EMOJI.map((icon, index) => (
            <button
              key={index}
              onClick={() => onSelect(icon)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors cursor-pointer"
              title={icon}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
