import { usePlaylistStore } from '../store/usePlaylistStore';
import CartItem from './CartItem';

function CartList() {
  const { cartItems } = usePlaylistStore();

  // 장바구니가 비어있을 때
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <span className="text-5xl mb-4">🎵</span>
        <p className="text-lg font-medium">플레이리스트가 비어있어요</p>
        <p className="text-sm mt-1">음반을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}

export default CartList;
