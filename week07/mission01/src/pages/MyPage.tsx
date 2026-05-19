import { useState, useRef, type ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, updateMyInfo } from "../apis/user";
import { uploadImage } from "../apis/upload";

const DefaultAvatar = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#374151" />
    <circle cx="50" cy="38" r="18" fill="#6b7280" />
    <ellipse cx="50" cy="85" rx="28" ry="22" fill="#6b7280" />
  </svg>
);

export default function MyPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }
      return updateMyInfo({
        name: nameInput || undefined,
        bio: bioInput || undefined,
        avatar: avatarUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    },
    onError: () => {
      alert("프로필 수정에 실패했습니다.");
    },
  });

  const handleEditStart = () => {
    if (!user) return;
    setNameInput(user.name);
    setBioInput(user.bio ?? "");
    setAvatarPreview(null);
    setAvatarFile(null);
    setIsEditing(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!nameInput.trim()) { alert("이름을 입력해주세요."); return; }
    mutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const displayAvatar = avatarPreview ?? user.avatar;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">마이페이지</h1>
        {!isEditing && (
          <button
            type="button"
            onClick={handleEditStart}
            className="text-gray-400 transition hover:text-white"
            aria-label="설정"
          >
            ⚙️
          </button>
        )}
      </div>

      {/* Profile card */}
      <div className="flex items-center gap-8 rounded-xl bg-[#111] p-8">
        {/* Avatar */}
        <div
          className={`relative h-32 w-32 shrink-0 overflow-hidden rounded-full ${isEditing ? "cursor-pointer" : ""}`}
          onClick={() => isEditing && fileInputRef.current?.click()}
        >
          {displayAvatar ? (
            <img src={displayAvatar} alt="프로필" className="h-full w-full object-cover" />
          ) : (
            <DefaultAvatar />
          )}
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white">
              변경
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3">
          {isEditing ? (
            <>
              {/* 이름 */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-600 bg-black px-4 py-2.5 text-white outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={mutation.isPending}
                  className="text-lg text-gray-300 transition hover:text-white disabled:opacity-50"
                  aria-label="저장"
                >
                  ✓
                </button>
              </div>

              {/* Bio */}
              <input
                type="text"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="자기소개 (선택)"
                className="rounded-lg border border-gray-600 bg-black px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
              />

              {/* 이메일 */}
              <p className="text-sm text-gray-400">{user.email}</p>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="self-start text-xs text-gray-500 transition hover:text-gray-300"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold text-white">{user.name}</p>
              {user.bio && <p className="text-sm text-gray-300">{user.bio}</p>}
              <p className="text-sm text-gray-400">{user.email}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
