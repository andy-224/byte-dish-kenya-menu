
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import MenuPage from '@/pages/MenuPage';
import RepeatOrderOption from './RepeatOrderOption';

const MenuPageWrapper = () => {
  const { tableId } = useParams<{ tableId?: string }>();
  const { setTableId } = useCart();
  
  useEffect(() => {
    if (tableId) {
      // Set table ID in the cart context and local storage
      setTableId(tableId);
      localStorage.setItem("currentTableId", tableId);
    }
  }, [tableId, setTableId]);
  
  return (
    <div>
      {tableId && <RepeatOrderOption tableId={tableId} />}
      <MenuPage />
    </div>
  );
};

export default MenuPageWrapper;
