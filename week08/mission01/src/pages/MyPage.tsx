import { useRef, useState, type ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMyInfo, updateMyInfo } from "../apis/user";
import { getMyLps, getLikedLps, deleteLp } from "../apis/lp";
import { uploadImage } from "../apis/upload";
import type { Lp, UserProfile } from "../apis/dto";
import { useAuth } from "../hooks/useAuth";
import LpEditModal from "../components/LpEditModal";
import ConfirmModal from "../components/ConfirmModal";

type Tab = "liked" | "authored";
type SortOrder = "asc" | "desc";

const DefaultAvatar = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#374151" />
    <circle cx="50" cy="38" r="18" fill="#6b7280" />
    <ellipse cx="50" cy="85" rx="28" ry="22" fill="#6b7280" />
  </svg>
);

/* ── LP 카드 (내가 작성한 LP 탭) ──────────────────── */
function MyLpCard({ lp, onDeleted, onEdit }: { lp: Lp; onDeleted: () => void; onEdit: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(lp.id),
    onSuccess: onDeleted,
  });

  return (
    <>
      <div className="flex items-center gap-4 rounded-xl bg-[#1a1a1a] p-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-800">
          {lp.thumbnail ? (
            <img src={lp.thumbnail} alt={lp.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-600 text-xs">No img</div>
          )}
        </div>
        <p className="flex-1 min-w-0 truncate text-sm font-medium text-white">{lp.title}</p>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onEdit} className="text-gray-400 transition hover:text-white" aria-label="수정">✏️</button>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={deleteMutation.isPending}
            className="text-gray-400 transition hover:text-red-400 disabled:opacity-50"
            aria-label="삭제"
          >🗑️</button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="삭제하시겠습니까?"
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setShowConfirm(false)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </>
  );
}

/* ── LP 썸네일 카드 (내가 좋아요 한 LP 탭) ────────── */
function LikedLpCard({ lp }: { lp: Lp }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/lps/${lp.id}`)}
      className="group relative w-full overflow-hidden rounded-xl bg-gray-800"
    >
      {lp.thumbnail ? (
        <img src={lp.thumbnail} alt={lp.title} className="w-full object-cover aspect-square" />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-gray-800 text-gray-600 text-xs">No img</div>
      )}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
        <p className="line-clamp-2 text-xs font-medium text-white">{lp.title}</p>
      </div>
    </button>
  );
}

/* ── MyPage ───────────────────────────────────────── */
export default function MyPage() {
  const queryClient = useQueryClient();
  const { updateName } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editingLp, setEditingLp] = useState<Lp | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("liked");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const { data: authoredData, isLoading: authoredLoading } = useInfiniteQuery({
    queryKey: ["myLps", sortOrder],
    queryFn: ({ pageParam }) => getMyLps(sortOrder, pageParam as number | undefined),
    getNextPageParam: (last) => last.data.hasNext ? (last.data.nextCursor ?? undefined) : undefined,
    initialPageParam: 0,
  });

  const { data: likedData, isLoading: likedLoading } = useInfiniteQuery({
    queryKey: ["likedLps", sortOrder],
    queryFn: ({ pageParam }) => getLikedLps(sortOrder, pageParam as number | undefined),
    getNextPageParam: (last) => last.data.hasNext ? (last.data.nextCursor ?? undefined) : undefined,
    initialPageParam: 0,
  });

  const myLps = authoredData?.pages.flatMap((p) => p.data.data) ?? [];
  const likedLps = likedData?.pages.flatMap((p) => p.data.data) ?? [];

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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });
      const previousUser = queryClient.getQueryData<UserProfile>(["myInfo"]);
      queryClient.setQueryData<UserProfile>(["myInfo"], (old) =>
        old ? { ...old, name: nameInput, bio: bioInput } : old
      );
      updateName(nameInput);
      return { previousUser };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["myInfo"], context.previousUser);
      }
      alert("프로필 수정에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      queryClient.invalidateQueries({ queryKey: ["lp"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["lps"], refetchType: "all" });
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
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
  const isLpsLoading = activeTab === "authored" ? authoredLoading : likedLoading;

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
      <div className="mb-6 flex items-center gap-8 rounded-xl bg-[#111] p-8">
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
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter") { if (!nameInput.trim()) { alert("이름을 입력해주세요."); return; } profileMutation.mutate(); }
                  }}
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
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === "Enter") { if (!nameInput.trim()) { alert("이름을 입력해주세요."); return; } profileMutation.mutate(); }
                }}
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

      {/* 탭 + 정렬 */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("liked")}
            className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === "liked"
                ? "border-white text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            내가 좋아요 한 LP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("authored")}
            className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === "authored"
                ? "border-white text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            내가 작성한 LP
          </button>
        </div>
        <div className="flex gap-1 pb-2">
          <button
            type="button"
            onClick={() => setSortOrder("asc")}
            className={`rounded px-3 py-1 text-xs transition ${
              sortOrder === "asc"
                ? "bg-white text-black font-semibold"
                : "border border-gray-600 text-gray-400 hover:text-white"
            }`}
          >
            오래된순
          </button>
          <button
            type="button"
            onClick={() => setSortOrder("desc")}
            className={`rounded px-3 py-1 text-xs transition ${
              sortOrder === "desc"
                ? "bg-white text-black font-semibold"
                : "border border-gray-600 text-gray-400 hover:text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* LP 목록 */}
      {isLpsLoading ? (
        <div className={activeTab === "liked" ? "grid grid-cols-2 gap-3" : "space-y-3"}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`animate-pulse rounded-xl bg-gray-800 ${activeTab === "liked" ? "aspect-square" : "h-20"}`} />
          ))}
        </div>
      ) : activeTab === "liked" ? (
        likedLps.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">좋아요 한 LP가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {likedLps.map((lp) => <LikedLpCard key={lp.id} lp={lp} />)}
          </div>
        )
      ) : (
        myLps.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">아직 등록한 LP가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {myLps.map((lp) => (
              <MyLpCard
                key={lp.id}
                lp={lp}
                onDeleted={() => queryClient.invalidateQueries({ queryKey: ["myLps", sortOrder] })}
                onEdit={() => setEditingLp(lp)}
              />
            ))}
          </div>
        )
      )}

      {editingLp && (
        <LpEditModal
          lp={editingLp}
          onClose={() => {
            setEditingLp(null);
            queryClient.invalidateQueries({ queryKey: ["myLps", sortOrder] });
          }}
        />
      )}
    </div>
  );
}
