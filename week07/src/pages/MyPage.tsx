import { useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useUpdateMyInfo from "../hooks/mutations/useUpdateMyInfo";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const { data, isPending, isError } = useGetMyInfo(isAuthenticated);
  const { mutate: updateMyInfo, isPending: isUpdating } = useUpdateMyInfo();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [saveError, setSaveError] = useState("");
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleEditOpen = () => {
    const user = data?.data;
    setEditName(user?.name ?? "");
    setEditBio(user?.bio ?? "");
    setEditAvatarPreview(user?.avatar ?? null);
    setEditAvatarFile(null);
    setSaveError("");
    setIsEditing(true);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditAvatarFile(file);
    setEditAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setSaveError("");
    updateMyInfo(
      {
        name: editName.trim(),
        bio: editBio.trim() || undefined,
        avatar: editAvatarFile ?? undefined,
      },
      {
        onSuccess: () => setIsEditing(false),
        onError: () => setSaveError("저장에 실패했습니다. 다시 시도해주세요."),
      },
    );
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-red-400 text-sm">내 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const user = data.data;

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      {/* 설정 모달 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col gap-5 w-96">
            <h2 className="text-lg font-bold text-gray-900">프로필 수정</h2>

            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => avatarFileRef.current?.click()}
                className="relative w-20 h-20 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center cursor-pointer group"
              >
                {editAvatarPreview ? (
                  <img src={editAvatarPreview} alt="프로필" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-blue-500 text-2xl font-bold">
                    {editName.charAt(0) || "?"}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </button>
              <span className="text-xs text-gray-400">클릭하여 사진 변경</span>
              <input
                ref={avatarFileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* 이름 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                이름 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="자기소개를 입력하세요 (선택)"
                rows={3}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors resize-none"
              />
            </div>

            {/* 에러 메시지 */}
            {saveError && (
              <p className="text-red-500 text-sm text-center -mt-2">{saveError}</p>
            )}

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isUpdating || !editName.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 프로필 카드 */}
      <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-sm flex flex-col items-center gap-5">
        {/* 설정 버튼 */}
        <button
          type="button"
          onClick={handleEditOpen}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* 아바타 */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.name} 프로필 이미지`}
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
            {user.name?.charAt(0) ?? "?"}
          </div>
        )}

        {/* 이름 / 이메일 / bio */}
        <div className="text-center flex flex-col gap-1">
          <h1 className="text-xl font-bold text-gray-900">{user.name}님 환영합니다.</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.bio && (
            <p className="text-sm text-gray-400 mt-1 whitespace-pre-wrap">{user.bio}</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full border border-gray-300 text-gray-600 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
