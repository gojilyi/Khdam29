import React from 'react';
import { UserCheck, Wrench, Check } from 'lucide-react';
import { UserRole } from '../../services/authService';

interface RoleSelectProps {
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ selectedRole, onSelect }) => {
  return (
    <div className="space-y-3">
      <div className="text-center space-y-1 mb-4">
        <h4 className="text-[16px] font-bold text-[#1C2421]">اختر نوع الحساب للبدء</h4>
        <p className="text-[12px] text-[#5B6660]">يمكنك طلب الحرفيين لبيتك أو الانضمام كحرفي معتمد</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Card 1: Client */}
        <button
          type="button"
          onClick={() => onSelect('client')}
          className={`p-4 rounded-[12px] border text-right transition-all flex flex-col justify-between min-h-[115px] cursor-pointer relative ${
            selectedRole === 'client'
              ? 'border-[#0F6B3F] bg-[#EEF6F1] shadow-[0_1px_3px_rgba(15,107,63,0.15)] ring-1 ring-[#0F6B3F]'
              : 'border-[#DDE3DF] bg-white hover:border-[#5B6660]'
          }`}
        >
          {selectedRole === 'client' && (
            <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-[#0F6B3F] text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
          )}
          <div className="w-9 h-9 rounded-[8px] bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center mb-2">
            <UserCheck className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#1C2421]">أبحث عن حرفي</div>
            <div className="text-[11px] text-[#5B6660] mt-0.5">طالب خدمة لصيانة وإصلاح منزلي</div>
          </div>
        </button>

        {/* Card 2: Craftsman */}
        <button
          type="button"
          onClick={() => onSelect('craftsman')}
          className={`p-4 rounded-[12px] border text-right transition-all flex flex-col justify-between min-h-[115px] cursor-pointer relative ${
            selectedRole === 'craftsman'
              ? 'border-[#0F6B3F] bg-[#EEF6F1] shadow-[0_1px_3px_rgba(15,107,63,0.15)] ring-1 ring-[#0F6B3F]'
              : 'border-[#DDE3DF] bg-white hover:border-[#5B6660]'
          }`}
        >
          {selectedRole === 'craftsman' && (
            <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-[#0F6B3F] text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
          )}
          <div className="w-9 h-9 rounded-[8px] bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center mb-2">
            <Wrench className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#1C2421]">أنا حرفي (عامل)</div>
            <div className="text-[11px] text-[#5B6660] mt-0.5">أعرض خدماتي واستقبل الطلبات في ولايتي</div>
          </div>
        </button>
      </div>
    </div>
  );
};
