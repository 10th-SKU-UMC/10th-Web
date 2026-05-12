import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp } from "../apis/lp";

export default function LpCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: () =>
      createLp({
        title,
        content,
        thumbnail: thumbnail || undefined,
        tags: tags.length > 0 ? tags : undefined,
        published: true,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate(`/lps/${res.data.id}`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? "알 수 없는 오류";
      alert(`LP 생성에 실패했습니다.\n${msg}`);
      console.error("LP 생성 오류:", error?.response?.data);
    },
  });

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-bold text-white">LP 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 썸네일 미리보기 */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-48 w-48">
            {thumbnail ? (
              <>
                <img
                  src={thumbnail}
                  alt="썸네일"
                  className="h-full w-full rounded-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-gray-900" />
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-800 text-gray-500 text-sm">
                미리보기
              </div>
            )}
          </div>

          <input
            type="url"
            placeholder="썸네일 이미지 URL (선택)"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-[#111] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
          />
        </div>

        {/* 제목 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            제목 <span className="text-pink-400">*</span>
          </label>
          <input
            type="text"
            placeholder="LP 제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-[#111] px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
          />
        </div>

        {/* 본문 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            내용
          </label>
          <textarea
            placeholder="LP에 대한 설명을 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-md border border-gray-600 bg-[#111] px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
          />
        </div>

        {/* 태그 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            태그
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="#태그 입력 후 Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 rounded-md border border-gray-600 bg-[#111] px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-md bg-gray-700 px-4 py-2.5 text-sm text-white hover:bg-gray-600 transition"
            >
              추가
            </button>
          </div>

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="h-12 w-full rounded-md bg-pink-500 font-semibold text-white transition hover:bg-pink-600 disabled:opacity-50"
        >
          {mutation.isPending ? "등록 중..." : "LP 등록하기"}
        </button>
      </form>
    </div>
  );
}
