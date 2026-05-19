import { useRef, useState, type ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { getMyInfo, updateMyInfo } from "../apis/user";
import { getMyLps, updateLp, deleteLp } from "../apis/lp";
import { uploadImage } from "../apis/upload";
import type { Lp } from "../apis/dto";

const DefaultAvatar = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#374151" />
    <circle cx="50" cy="38" r="18" fill="#6b7280" />
    <ellipse cx="50" cy="85" rx="28" ry="22" fill="#6b7280" />
  </svg>
);

/* ── LP 카드 (인라인 수정) ─────────────────────────── */
function MyLpCard({ lp, onDeleted }: { lp: Lp; onDeleted: () => void }) {
  const queryClient = useQueryClient();
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(lp.title);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: async () => {
      let thumbnail: string | undefined;
      if (imgFile) thumbnail = await uploadImage(imgFile);
      return updateLp(lp.id, {
        title: titleInput.trim() || lp.title,
        thumbnail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLps"] });
      setEditing(false);
      setImgFile(null);
      setImgPreview(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(lp.id),
    onSuccess: onDeleted,
  });

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const thumbnail = imgPreview ?? lp.thumbnail;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-[#1a1a1a] p-3">
      {/* 썸네일 */}
      <div
        className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-800 ${editing ? "cursor-pointer" : ""}`}
        onClick={() => editing && imgInputRef.current?.click()}
      >
        {thumbnail ? (
          <img src={thumbnail} alt={lp.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-600 text-xs">No img</div>
        )}
      </div>
      <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImgChange} />

      {/* 제목 */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            autoFocus
            className="w-full rounded-md border border-gray-600 bg-black px-3 py-1.5 text-sm text-white outline-none focus:border-pink-500"
          />
        ) : (
          <p className="truncate text-sm font-medium text-white">{lp.title}</p>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex shrink-0 items-center gap-2">
        {editing ? (
          <>
            {/* 이미지 변경 */}
            <button
              type="button"
              onClick={() => imgInputRef.current?.click()}
              className="text-gray-400 transition hover:text-white"
              aria-label="이미지 변경"
            >
              🖼️
            </button>
            {/* 저장 */}
            <button
              type="button"
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="text-gray-300 transition hover:text-white disabled:opacity-50"
              aria-label="저장"
            >
              ✓
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => { setTitleInput(lp.title); setEditing(true); }}
            className="text-gray-400 transition hover:text-white"
            aria-label="수정"
          >
            ✏️
          </button>
        )}
        <button
          type="button"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="text-gray-400 transition hover:text-red-400 disabled:opacity-50"
          aria-label="삭제"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

/* ── MyPage ───────────────────────────────────────── */
export default function MyPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const { data: lpData, isLoading: lpsLoading } = useInfiniteQuery({
    queryKey: ["myLps"],
    queryFn: ({ pageParam }) => getMyLps("desc", pageParam as number | undefined),
    getNextPageParam: (last) => last.data.hasNext ? (last.data.nextCursor ?? undefined) : undefined,
    initialPageParam: 0,
  });

  const myLps = lpData?.pages.flatMap((p) => p.data.data) ?? [];

  const profileMutation = useMutation({
    mutationFn: async () => {
      let avatarUrl: string | undefined;
      if (avatarFile) avatarUrl = await uploadImage(avatarFile);
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
    onError: () => alert("프로필 수정에 실패했습니다."),
  });

  const handleEditStart = () => {
    if (!user) return;
    setNameInput(user.name);
    setBioInput(user.bio ?? "");
    setAvatarPreview(null);
    setAvatarFile(null);
    setIsEditing(true);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  if (userLoading) {
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
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">마이페이지</h1>
        {!isEditing && (
          <button type="button" onClick={handleEditStart} className="text-gray-400 transition hover:text-white" aria-label="설정">
            ⚙️
          </button>
        )}
      </div>

      {/* 프로필 카드 */}
      <div className="mb-8 flex items-center gap-8 rounded-xl bg-[#111] p-8">
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white">변경</div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

        <div className="flex flex-1 flex-col gap-3">
          {isEditing ? (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-600 bg-black px-4 py-2.5 text-white outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={() => { if (!nameInput.trim()) { alert("이름을 입력해주세요."); return; } profileMutation.mutate(); }}
                  disabled={profileMutation.isPending}
                  className="text-lg text-gray-300 transition hover:text-white disabled:opacity-50"
                >
                  ✓
                </button>
              </div>
              <input
                type="text"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="자기소개 (선택)"
                className="rounded-lg border border-gray-600 bg-black px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-pink-500"
              />
              <p className="text-sm text-gray-400">{user.email}</p>
              <button type="button" onClick={() => setIsEditing(false)} className="self-start text-xs text-gray-500 transition hover:text-gray-300">취소</button>
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

      {/* 내 LP 목록 */}
      <h2 className="mb-4 text-lg font-semibold text-white">내 LP</h2>
      {lpsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-800" />
          ))}
        </div>
      ) : myLps.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">아직 등록한 LP가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {myLps.map((lp) => (
            <MyLpCard
              key={lp.id}
              lp={lp}
              onDeleted={() => queryClient.invalidateQueries({ queryKey: ["myLps"] })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
