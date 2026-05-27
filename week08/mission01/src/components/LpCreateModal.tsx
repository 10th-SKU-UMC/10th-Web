import { useRef, useState, useEffect, type ChangeEvent, type KeyboardEvent, type SyntheticEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createLp } from "../apis/lp";
import { uploadImage } from "../apis/upload";

const VinylRecord = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="98" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
    <circle cx="100" cy="100" r="80" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <circle cx="100" cy="100" r="60" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1" />
    <circle cx="100" cy="100" r="40" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <circle cx="100" cy="100" r="20" fill="#222" stroke="#444" strokeWidth="1" />
    <circle cx="100" cy="100" r="8" fill="#f0f0f0" />
    <circle cx="100" cy="100" r="4" fill="#1a1a1a" />
  </svg>
);

interface Props {
  onClose: () => void;
}

export default function LpCreateModal({ onClose }: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Blob URL 메모리 누수 방지: previewUrl 교체·언마운트 시 revoke
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const mutation = useMutation({
    mutationFn: async () => {
      let thumbnailUrl: string | undefined;
      if (imageFile) {
        thumbnailUrl = await uploadImage(imageFile);
      }
      return createLp({
        title,
        content,
        thumbnail: thumbnailUrl,
        tags,
        published: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      onClose();
    },
    onError: (error: AxiosError<{ message: string | string[] }>) => {
      const raw = error.response?.data?.message;
      const msg = Array.isArray(raw) ? raw.join("\n") : (raw ?? "알 수 없는 오류");
      alert(`LP 생성에 실패했습니다.\n${msg}`);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!content.trim()) { alert("내용을 입력해주세요."); return; }
    if (tags.length === 0) { alert("태그를 하나 이상 입력해주세요."); return; }
    mutation.mutate();
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm rounded-xl bg-[#1c1c1c] p-6 shadow-2xl">
        {/* X 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-white"
          aria-label="닫기"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 이미지 업로드 — label로 키보드 접근 가능 */}
          <label
            htmlFor="lp-create-file-input"
            className="relative mx-auto block h-52 cursor-pointer"
            style={{ width: previewUrl ? "284px" : "176px" }}
            aria-label="이미지 선택"
          >
            {previewUrl ? (
              <>
                {/* 바이닐 - 뒤, 오른쪽, 수직 중앙 */}
                <div className="absolute right-0 top-1/2 z-0 h-44 w-44 -translate-y-1/2">
                  <VinylRecord />
                </div>
                {/* 이미지 - 앞, 바이닐보다 조금 크게 */}
                <img
                  src={previewUrl}
                  alt="미리보기"
                  className="absolute left-0 top-0 z-10 h-52 w-52 rounded-lg object-cover"
                />
              </>
            ) : (
              <div className="h-44 w-44">
                <VinylRecord />
              </div>
            )}
          </label>
          <input
            ref={fileInputRef}
            id="lp-create-file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* LP Name */}
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-[#111] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
          />

          {/* LP Content */}
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-[#111] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
          />

          {/* LP Tag */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 rounded-md border border-gray-700 bg-[#111] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-md bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pink-600"
            >
              Add
            </button>
          </div>

          {/* 태그 목록 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    className="ml-0.5 text-gray-500 transition hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add LP */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="h-11 w-full rounded-lg bg-pink-500 font-semibold text-white transition hover:bg-pink-600 disabled:opacity-50"
          >
            {mutation.isPending ? "업로드 중..." : "Add LP"}
          </button>
        </form>
      </div>
    </div>
  );
}
