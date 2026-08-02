import { BedDouble, Check, DoorOpen } from "lucide-react";
import { buildRoomLayout } from "../../lib/roomLayout";
import BunkCotIcon from "./BunkCotIcon";
import SingleBedIcon from "./SingleBedIcon";

const isAvailable = (bed) => bed.status === "Available";
const statusLabel = (bed, selectedBed) => (selectedBed?.id === bed.id ? "Selected" : isAvailable(bed) ? "Available" : "Booked");

const StatePill = ({ state }) => (
  <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${state === "Selected" ? "bg-indigo-600 text-white" : state === "Available" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
    {state}
  </span>
);

const SingleBedCard = ({ bed, index, selected, onSelect }) => {
  const available = isAvailable(bed);
  const active = selected?.id === bed.id;
  const state = statusLabel(bed, selected);
  return (
    <button type="button" disabled={!available} onClick={() => onSelect(bed)} aria-pressed={active} className={`flex h-full min-h-[174px] w-full flex-col items-center rounded-xl border p-4 text-center shadow-[0_10px_22px_rgba(31,41,55,0.08)] outline-none transition focus-visible:ring-4 focus-visible:ring-indigo-200 ${active ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200" : available ? "border-[#e8d7d7] bg-white hover:-translate-y-1 hover:border-emerald-300" : "cursor-not-allowed border-rose-100 bg-rose-50 opacity-70"}`}>
      <span className={`mr-auto grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${active ? "bg-indigo-600 text-white" : "bg-emerald-100 text-emerald-700"}`}>{active ? <Check className="h-4 w-4" /> : index + 1}</span>
      <SingleBedIcon className={`h-28 w-32 ${!available ? "opacity-40 grayscale" : ""}`} />
      <span className="-mt-1 font-semibold text-ink">{bed.label}</span>
      <span className="mt-1"><StatePill state={state} /></span>
    </button>
  );
};

const BerthRow = ({ berth, selected, onSelect }) => {
  const available = isAvailable(berth);
  const active = selected?.id === berth.id;
  const state = statusLabel(berth, selected);
  const title = berth.berthPosition === "UPPER" ? "Upper berth" : "Lower berth";
  return (
    <button type="button" disabled={!available} onClick={() => onSelect(berth)} aria-pressed={active} className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left outline-none transition focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-indigo-200 ${active ? "bg-indigo-50" : available ? "bg-white hover:bg-emerald-50" : "cursor-not-allowed bg-rose-50 opacity-70"}`}>
      <span className="flex min-w-0 items-center gap-2.5">
        {active ? <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-600 text-white"><Check className="h-3 w-3" /></span> : !available ? <span className="h-4 w-4 shrink-0 rounded-full bg-rose-300" /> : <span className="h-4 w-4 shrink-0 rounded-full bg-emerald-500" />}
        <span className="min-w-0"><span className="block text-sm font-bold text-ink">{title}</span><span className="block text-[10px] font-bold uppercase tracking-wide text-secondary">Same room rate</span></span>
      </span>
      <StatePill state={state} />
    </button>
  );
};

const CotCard = ({ slot, selected, onSelect }) => (
  <div className="flex h-full min-h-[174px] overflow-hidden rounded-xl border border-[#e7d4d4] bg-white shadow-[0_10px_22px_rgba(31,41,55,0.08)]">
    <div className="grid w-[42%] shrink-0 place-items-center border-r border-[#e7d4d4] bg-[#fffafa]"><BunkCotIcon className="h-32 w-32 sm:h-36 sm:w-36" /></div>
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center justify-center gap-2 bg-[#17212d] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white"><BedDouble className="h-3.5 w-3.5" /> Cot {slot.cotCode}</div>
      <div className="flex flex-1 flex-col divide-y divide-[#eadede]">{slot.berths.map((berth) => <BerthRow key={berth.id} berth={berth} selected={selected} onSelect={onSelect} />)}</div>
    </div>
  </div>
);

const RoomLayout = ({ beds, selectedBed, onSelect }) => {
  const rows = buildRoomLayout(beds);
  return (
    <div className="mt-4 rounded-2xl border border-[#ecdada] bg-[#fff8f8] p-4 sm:mt-5 sm:p-5">
      <div className="relative z-10 -mb-1 flex justify-center"><div className="inline-flex items-center gap-2 rounded-full bg-[#17212d] px-7 py-2.5 text-xs font-bold uppercase tracking-[0.22em] text-white shadow-lg"><DoorOpen className="h-3.5 w-3.5" /> Entrance</div></div>
      <div className="rounded-2xl border border-dashed border-[#d6aaaa] bg-white/65 px-4 pb-5 pt-8 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rows.flatMap((row) => row.items).map((item) => (
            <div key={item.kind === "cot" ? item.cotCode : item.bed.id} className={`mx-auto w-full max-w-md ${item.position === "center" ? "md:col-span-2" : ""}`}>
              {item.kind === "cot" ? <CotCard slot={item} selected={selectedBed} onSelect={onSelect} /> : <SingleBedCard bed={item.bed} index={item.index} selected={selectedBed} onSelect={onSelect} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomLayout;
