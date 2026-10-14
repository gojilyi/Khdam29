import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockRentalVehicles } from '../data/mockData';
import { RentalVehicleItem, RentalVehicleType } from '../types';
import { 
  X, 
  Car, 
  Truck, 
  Wrench, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Star, 
  Phone, 
  CheckCircle2, 
  Check, 
  Filter, 
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Fuel,
  Users
} from 'lucide-react';

interface VehicleRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: RentalVehicleItem | null;
}

export const VehicleRentalModal: React.FC<VehicleRentalModalProps> = ({
  isOpen,
  onClose,
  initialVehicle
}) => {
  const { currentUser, createOrder, selectedCity, startCall } = useApp();

  const [activeType, setActiveType] = useState<'all' | RentalVehicleType>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<RentalVehicleItem | null>(initialVehicle || null);
  
  // Booking Form State
  const [isBookingStep, setIsBookingStep] = useState(false);
  const [rentalDays, setRentalDays] = useState(2);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [withDriverOption, setWithDriverOption] = useState(false);
  const [clientName, setClientName] = useState(currentUser.name || 'هشام بن علي');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '+213 550 12 34 56');
  const [pickupLocation, setPickupLocation] = useState(currentUser.address || 'الجزائر العاصمة');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredVehicles = mockRentalVehicles.filter(veh => {
    if (activeType !== 'all' && veh.type !== activeType) return false;
    if (selectedWilaya !== 'all' && !veh.wilaya.includes(selectedWilaya)) return false;
    return true;
  });

  const handleOpenBooking = (vehicle: RentalVehicleItem) => {
    setSelectedVehicle(vehicle);
    setWithDriverOption(vehicle.withDriver);
    setIsBookingStep(true);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const basePrice = selectedVehicle.pricePerDay * rentalDays;
    const driverFee = (withDriverOption && !selectedVehicle.withDriver) ? (2500 * rentalDays) : 0;
    const totalEstimate = basePrice + driverFee;

    createOrder({
      categoryId: 'vehicle_truck_rentals',
      subServiceId: selectedVehicle.id,
      subServiceName: `حجز كراء: ${selectedVehicle.title}`,
      type: 'scheduled',
      scheduledDate: startDate,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientPhoneVisible: true,
      preferredContact: 'direct_call',
      address: pickupLocation.trim(),
      city: selectedVehicle.wilaya,
      notes: `المركبة: ${selectedVehicle.title} | المدة: ${rentalDays} أيام | البداية: ${startDate} | الخيار: ${withDriverOption ? 'مع سائق' : 'بدون سائق'} | الوكالة: ${selectedVehicle.agencyName} (${selectedVehicle.agencyPhone})`,
      estimatedCost: totalEstimate
    });

    setBookingSuccess(true);
  };

  const calculateTotal = () => {
    if (!selectedVehicle) return 0;
    const base = selectedVehicle.pricePerDay * rentalDays;
    const driver = (withDriverOption && !selectedVehicle.withDriver) ? (2500 * rentalDays) : 0;
    return base + driver;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute rtl:left-4 ltr:right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              <span>أسطول معتمد بعقود نظامية وتأمين شامل لكافة الولايات</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
              كراء واستئجار السيارات والشاحنات والعربات
            </h3>
          </div>
        </div>

        {!isBookingStep ? (
          <div className="mt-5 space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Type Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveType('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeType === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  جميع المركبات
                </button>
                <button
                  onClick={() => setActiveType('car')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeType === 'car'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>سيارات سياحية</span>
                </button>
                <button
                  onClick={() => setActiveType('truck')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeType === 'truck'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>شاحنات نقل وبضائع</span>
                </button>
                <button
                  onClick={() => setActiveType('cart_towing')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeType === 'cart_towing'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>عربات سحب ومقطورات</span>
                </button>
              </div>

              {/* Wilaya Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="all">جميع الولايات (الكل)</option>
                  <option value="الجزائر العاصمة">الجزائر العاصمة</option>
                  <option value="وهران">وهران</option>
                  <option value="قسنطينة">قسنطينة</option>
                  <option value="سطيف">سطيف</option>
                  <option value="البليدة">البليدة</option>
                </select>
              </div>
            </div>

            {/* Vehicles Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVehicles.map((veh) => (
                <div
                  key={veh.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Vehicle Image Header */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={veh.image}
                      alt={veh.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 rtl:right-3 ltr:left-3 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-black backdrop-blur-md flex items-center gap-1">
                      {veh.type === 'car' ? <Car className="w-3 h-3" /> : veh.type === 'truck' ? <Truck className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                      <span>{veh.type === 'car' ? 'سيارة سياحية' : veh.type === 'truck' ? 'شاحنة نقل' : 'عربة سحب ومقطورة'}</span>
                    </div>

                    <div className="absolute top-3 rtl:left-3 ltr:right-3 px-2.5 py-1 rounded-full bg-black/60 text-amber-300 text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{veh.rating} ({veh.reviewCount} تقييم)</span>
                    </div>

                    <div className="absolute bottom-3 rtl:right-3 ltr:left-3 rtl:left-3 ltr:right-3 flex items-end justify-between text-white">
                      <div>
                        <h4 className="font-black text-sm text-white drop-shadow-md">
                          {veh.title}
                        </h4>
                        <span className="text-[11px] text-slate-300 flex items-center gap-1 drop-shadow-sm">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{veh.wilaya} · {veh.city}</span>
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-base font-black text-amber-300 drop-shadow-md">
                          {veh.pricePerDay.toLocaleString()} دج
                        </span>
                        <span className="text-[10px] text-slate-300 block">/ اليوم</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    {/* Specs Pills */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                      <div>
                        <span className="text-slate-400 block text-[9px]">ناقل الحركة:</span>
                        <span>{veh.transmission === 'automatic' ? 'أوتوماتيك' : 'يدوي'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">الوقود:</span>
                        <span>{veh.fuelType === 'diesel' ? 'مازوت (ديزل)' : 'بنزين'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">الموديل:</span>
                        <span>سنة {veh.year}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-1.5">
                      {veh.features.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    {/* Agency and CTAs */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate">
                          {veh.agencyName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {veh.withDriver ? 'متوفر مع سائق مهني' : 'إمكانية القيادة الذاتية'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => startCall(veh.agencyName, 'وكالة كراء سيارات', veh.image)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                          title="اتصال بالوكالة"
                        >
                          <Phone className="w-4 h-4 text-emerald-500" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenBooking(veh)}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>حجز واستئجار</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* BOOKING STEP */
          <div className="mt-5 space-y-6 animate-fade-in">
            <button
              onClick={() => setIsBookingStep(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لقائمة السيارات والشاحنات</span>
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    تم تأكيد طلب الحجز والاستئجار بنجاح!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    تم إدراج طلبك في قائمة طلباتك النشطة. تم إشعار وكالة {selectedVehicle?.agencyName} وسيتصل بك المسؤول لتسليم المفاتيح أو إرسال المركبة لموقعك.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 max-w-md mx-auto text-start space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">المركبة:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedVehicle?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">المدة:</span>
                    <span className="font-bold text-blue-600">{rentalDays} أيام ابتداءً من {startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">الخيار:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{withDriverOption ? 'مع سائق خاص' : 'بدون سائق'}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">التكلفة التقديرية:</span>
                    <span className="font-black text-emerald-600">{calculateTotal().toLocaleString()} دج</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <a
                    href={`https://wa.me/${selectedVehicle?.agencyPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`السلام عليكم، قمت بحجز ${selectedVehicle?.title} عبر تطبيق خدام لمدة ${rentalDays} أيام. أود التنسيق معكم لاستلام السيارة.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>مراسلة الوكالة عبر واتساب للتنسيق</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs sm:text-sm transition-colors"
                  >
                    إغلاق والعودة للتطبيق
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-5">
                {/* Selected vehicle summary */}
                {selectedVehicle && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <img
                      src={selectedVehicle.image}
                      alt={selectedVehicle.title}
                      className="w-20 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-0.5 flex-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        {selectedVehicle.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {selectedVehicle.agencyName} · {selectedVehicle.wilaya}
                      </p>
                      <span className="text-xs font-black text-blue-700 dark:text-blue-300">
                        {selectedVehicle.pricePerDay.toLocaleString()} دج / اليوم
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      تاريخ بدء الاستئجار *
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      عدد أيام الاستئجار *
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-sm flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={rentalDays}
                        onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 text-center text-xs font-black text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setRentalDays(rentalDays + 1)}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-sm flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Driver Option Toggle */}
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      طلب سائق مهني مرافق
                    </span>
                    <span className="text-[11px] text-slate-500">
                      سائق ذو خبرة بالطرق الوطنية والمدن لنقل البضائع أو الرحلات المريحة
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={withDriverOption}
                      onChange={(e) => setWithDriverOption(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Client Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      الاسم الكامل للمستأجر *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      رقم الهاتف للتواصل وتأكيد الحجز *
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    مكان استلام المركبة أو عنوان التوصيل
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="مثال: مطار هواري بومدين أو عند باب المنزل"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* Total and Submit */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div>
                    <span className="text-xs text-blue-200 block">إجمالي تكلفة الاستئجار التقديرية ({rentalDays} أيام):</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-amber-300">
                        {calculateTotal().toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-blue-200">دج (شامل التأمين)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تأكيد حجز واستئجار المركبة الآن</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
