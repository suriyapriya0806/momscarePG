import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import RoomLayout from "../../components/booking/RoomLayout";
import { bookingBranches, bookingRooms, formatCurrency } from "../../data/bookingFlow";
import { useLiveAvailability } from "../../lib/liveAvailability";

const selectedBedLabel = (room, bed) => {
  if (!bed) return "Select an available bed";
  if (bed.cotCode && bed.berthPosition) return `Room ${room.number} — Cot ${bed.cotCode} — ${bed.berthPosition[0] + bed.berthPosition.slice(1).toLowerCase()} berth`;
  return bed.label;
};

const Legend = () => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-ink">
    <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-emerald-500" />Available</span>
    <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-rose-300" />Booked</span>
    <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm border-2 border-[#17212d]" />Upper / lower berths</span>
    <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-indigo-600" />Selected</span>
  </div>
);

const BedSelection = () => {
  const { roomId } = useParams();
  const [selectedBed, setSelectedBed] = useState(null);
  const { beds: liveBeds, rooms: liveRooms } = useLiveAvailability();
  const baseRoom = bookingRooms.find((item) => item.id === roomId);
  if (!baseRoom) return <Navigate to="/branches" replace />;
  const liveRoom = liveRooms.find((item) => item.id === baseRoom.id);
  const roomBeds = liveBeds.filter((bed) => bed.roomId === baseRoom.id);
  const room = liveRoom ? { ...baseRoom, beds: liveRoom.totalBeds, status: liveRoom.overallAvailability, monthlyRent: liveRoom.monthlyRent || baseRoom.monthlyRent, bedList: roomBeds.length ? roomBeds.map((bed) => ({ ...bed, id: bed.id, label: bed.bedName, status: bed.status })) : baseRoom.bedList } : baseRoom;
  const branch = bookingBranches.find((item) => item.id === room.branchId);
  if (!branch) return <Navigate to="/branches" replace />;
  const summary = [["Branch", branch.name], ["Room Number", `Room ${room.number}`], ["Sharing Type", room.sharingType], ["AC / Non AC", room.roomType], ["Selected Bed", selectedBedLabel(room, selectedBed)], ["Monthly Rent", formatCurrency(room.monthlyRent)], ["Security Deposit", formatCurrency(room.securityDeposit)], ["Booking Amount", formatCurrency(room.bookingAmount)]];

  return <main className="min-h-[calc(100vh-73px)] bg-[#fff7f7] pb-8">
    <section className="border-b border-[#f0e2e2] bg-white"><div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 sm:py-8 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a96d72]">Bed Selection</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#17212d] sm:text-4xl">Room {room.number}</h1><p className="mt-1 text-sm text-ink sm:text-base">{branch.name} · {room.sharingType} · {room.roomType}</p></div></section>
    <section className="mx-auto max-w-7xl space-y-5 px-5 py-7 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[#ebdddd] bg-white p-4 shadow-[0_12px_30px_rgba(31,41,55,0.07)] sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-[#17212d]">Select a Bed</h2><p className="mt-0.5 text-sm text-secondary">Only available beds can be selected.</p></div><Legend /></div>
        <RoomLayout beds={room.bedList} selectedBed={selectedBed} onSelect={setSelectedBed} />
      </div>
      <div className="rounded-2xl border border-[#ebdddd] bg-white p-4 shadow-[0_12px_30px_rgba(31,41,55,0.07)] sm:p-5"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a96d72]">Booking Summary</p><h2 className="mt-1 text-xl font-semibold text-[#17212d]">Your Selection</h2><dl className="mt-2 divide-y divide-[#eee5e5] text-sm">{summary.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-5 py-1.5"><dt className="text-ink">{label}</dt><dd className={`text-right font-semibold text-[#17212d] ${label === "Selected Bed" && !selectedBed ? "font-medium text-secondary" : ""}`}>{value}</dd></div>)}</dl>
        {selectedBed ? <Link to={`/booking-details?roomId=${room.id}&bedId=${selectedBed.id}`} state={{ roomId: room.id, bedId: selectedBed.id, berthPosition: selectedBed.berthPosition || "", cotCode: selectedBed.cotCode || "", selectedBed }} className="mt-4 block"><Button className="w-full">Continue Booking</Button></Link> : <Button className="mt-4 w-full" disabled>Continue Booking</Button>}
        <Link to={`/branches/${branch.id}/rooms`} className="mt-2 block"><Button variant="secondary" className="w-full">Back to Rooms</Button></Link>
      </div>
    </section>
  </main>;
};

export default BedSelection;
