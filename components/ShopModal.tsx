import React from 'react';
import { ShoppingBag, Check, X, Coins, Gem, Landmark } from 'lucide-react';
import { ShopItem, PlayerInventory } from '../types';
import { SHOP_ITEMS } from '../constants';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: PlayerInventory;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
  onBuyDiamond: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose, inventory, onBuy, onEquip, onBuyDiamond }) => {
  if (!isOpen) return null;

  const suits = SHOP_ITEMS.filter(i => i.type === 'suit');
  const ties = SHOP_ITEMS.filter(i => i.type === 'tie');
  const decor = SHOP_ITEMS.filter(i => i.type === 'decor');
  const accessories = SHOP_ITEMS.filter(i => i.type === 'accessory');

  const renderItemCard = (item: ShopItem) => {
    const isOwned = inventory.ownedItems.includes(item.id);
    let isEquipped = false;
    
    if (item.type === 'suit') isEquipped = inventory.equippedSuitId === item.id;
    else if (item.type === 'tie') isEquipped = inventory.equippedTieId === item.id;
    else if (item.type === 'decor') isEquipped = inventory.equippedDecorId === item.id;
    else if (item.type === 'accessory') isEquipped = inventory.equippedAccessoryId === item.id;

    const canAfford = item.currency === 'coins' 
      ? inventory.coins >= item.price 
      : inventory.diamonds >= item.price;

    return (
      <div key={item.id} className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all ${isEquipped ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
        
        {/* Preview */}
        <div className="w-16 h-16 rounded-full mb-2 flex items-center justify-center shadow-inner" style={{ background: `linear-gradient(135deg, ${item.primaryColor}, ${item.secondaryColor})` }}>
          {isEquipped && <Check className="text-white w-8 h-8 drop-shadow-md" />}
        </div>
        
        <h4 className="font-bold text-sm text-center text-gray-800 leading-tight mb-2 h-8 flex items-center justify-center">{item.name}</h4>

        {isOwned ? (
          <button 
            onClick={() => onEquip(item)}
            disabled={isEquipped}
            className={`w-full py-1.5 text-xs font-bold rounded-lg transition-colors ${
              isEquipped 
                ? 'bg-green-500 text-white cursor-default' 
                : 'bg-ledger-600 text-white hover:bg-ledger-700'
            }`}
          >
            {isEquipped ? 'Equipado' : 'Equipar'}
          </button>
        ) : (
          <button 
            onClick={() => onBuy(item)}
            disabled={!canAfford}
            className={`w-full py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors ${
              canAfford 
                ? 'bg-gold-400 text-ledger-900 hover:bg-gold-500' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {item.price === 0 ? 'Gratis' : (
              <>
                {item.currency === 'coins' ? <Coins className="w-3 h-3" /> : <Gem className="w-3 h-3" />}
                {item.price}
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ledger-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden ring-4 ring-gold-500/30">
        {/* Header */}
        <div className="p-5 bg-ledger-50 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-100 rounded-full text-gold-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ledger-900">Sastrería Contable & Oficina</h2>
              <p className="text-xs text-gray-500 font-medium">Personaliza tu estilo profesional y tu entorno</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8 bg-gray-50/50 flex-1">
          
          {/* Currency Display inside Modal */}
          <div className="flex gap-4 justify-center mb-4 sticky top-0 bg-gray-50/95 backdrop-blur py-2 z-10 border-b border-gray-100">
             <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
               <div className="bg-yellow-100 p-1 rounded-full"><Coins className="w-4 h-4 text-yellow-600" /></div>
               <span className="font-mono font-bold text-gray-700">{inventory.coins}</span>
             </div>
             <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                <div className="bg-purple-100 p-1 rounded-full"><Gem className="w-4 h-4 text-purple-600" /></div>
               <span className="font-mono font-bold text-gray-700">{inventory.diamonds}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* BANK SECTION */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-ledger-900 to-ledger-800 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-white/20 pb-2">
                  <Landmark className="w-5 h-5 text-gold-400" />
                  Banca
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                   <button onClick={onBuyDiamond} disabled={inventory.coins < 200} className={`flex-1 bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between transition-colors group ${inventory.coins < 200 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}>
                     <div className="flex items-center gap-3">
                        <div className="bg-purple-500/20 p-2 rounded-lg"><Gem className="w-6 h-6 text-purple-400" /></div>
                        <div className="text-left">
                          <div className="font-bold">Comprar Diamante</div>
                          <div className="text-xs text-gray-300">Inversión a largo plazo</div>
                        </div>
                     </div>
                     <div className="font-mono font-bold text-red-300 text-lg group-hover:scale-110 transition-transform">-200</div>
                  </button>
                </div>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold text-ledger-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-ledger-500 rounded-full"></span>
                  Trajes Ejecutivos
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {suits.map(renderItemCard)}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-ledger-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gold-500 rounded-full"></span>
                  Corbatas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {ties.map(renderItemCard)}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold text-ledger-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                  Decoración de Oficina
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {decor.map(renderItemCard)}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-ledger-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                  Accesorios de Escritorio
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {accessories.map(renderItemCard)}
                </div>
              </section>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShopModal;