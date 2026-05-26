import { useRef, useState, useEffect, type ChangeEvent, type KeyboardEvent } from "react";
import useCreateLp from "../hooks/mutations/useCreateLp";

interface LpFormModalProps {
  onClose: () => void;
}

const LpFormModal = ({ onClose }: LpFormModalProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { mutate: createLp, isPending } = useCreateLp();

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setThumbnail(objectUrl);
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setTagError("이미 추가된 태그입니다.");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
    setTagError("");
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    createLp(
      {
        title: title.trim(),
        content: content.trim(),
        thumbnail: thumbnail ?? undefined,
        tags,
        published: true,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] overflow-y-auto flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">새 LP 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          {/* 썸네일 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">LP 사진</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-44 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 flex items-center justify-center cursor-pointer overflow-hidden transition-colors bg-gray-50"
            >
              {thumbnail ? (
                <img src={thumbnail} alt="thumbnail preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span className="text-sm">클릭하여 사진 업로드</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* LP Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">LP Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LP 제목을 입력하세요"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* LP Content */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">LP Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="LP 내용을 입력하세요"
              rows={4}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors resize-none"
            />
          </div>

          {/* LP Tag */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">LP Tag</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  if (tagError) setTagError("");
                }}
                onKeyDown={handleTagKeyDown}
                placeholder="태그를 입력하세요"
                className={`flex-1 border rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors ${
                  tagError
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 focus:border-blue-400"
                }`}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {tagError && (
              <p className="text-xs text-red-400">{tagError}</p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-400 hover:text-blue-600 cursor-pointer leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || isPending}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isPending ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpFormModal;
