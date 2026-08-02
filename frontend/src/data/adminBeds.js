import { isLaunchBranchId, registerLaunchBranchIds } from "./launchScope";

export const BED_STORAGE_KEY = "pg_admin_beds";

export const BED_STATUSES = ["Available", "Occupied", "Reserved", "Maintenance"];
export const BED_TYPES = ["Single Cot", "Double Cot (Bunk)"];

export const luxuryBedImage = "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=900&q=82";

export const defaultBeds = [
  {
    id: "anna-101-c2-upper", branchId: "anna-nagar", branchName: "Anna Nagar", roomId: "anna-101", roomNumber: "101", sharingType: "4 Sharing",
    bedName: "Cot C2 · Upper", bedCode: "BED101C2-U", bedType: "Double Cot (Bunk)", cotCode: "C2", berthPosition: "UPPER", bedImage: luxuryBedImage,
    status: "Occupied", currentResident: "Rahul Kumar", bookingId: "BK-AN-101B", checkInDate: "2026-06-01", checkOutDate: "2027-05-31",
    description: "Upper berth of double cot C2 assigned to an active resident."
  },
  {
    id: "anna-101-c2-lower", branchId: "anna-nagar", branchName: "Anna Nagar", roomId: "anna-101", roomNumber: "101", sharingType: "4 Sharing",
    bedName: "Cot C2 · Lower", bedCode: "BED101C2-L", bedType: "Double Cot (Bunk)", cotCode: "C2", berthPosition: "LOWER", bedImage: luxuryBedImage,
    status: "Available", currentResident: "", bookingId: "", checkInDate: "", checkOutDate: "",
    description: "Lower berth of double cot C2."
  },
  {
    id: "anna-101-c1-upper", branchId: "anna-nagar", branchName: "Anna Nagar", roomId: "anna-101", roomNumber: "101", sharingType: "4 Sharing",
    bedName: "Cot C1 · Upper", bedCode: "BED101C1-U", bedType: "Double Cot (Bunk)", cotCode: "C1", berthPosition: "UPPER", bedImage: luxuryBedImage,
    status: "Available", currentResident: "", bookingId: "", checkInDate: "", checkOutDate: "", description: "Upper berth of double cot C1."
  },
  {
    id: "anna-101-c1-lower", branchId: "anna-nagar", branchName: "Anna Nagar", roomId: "anna-101", roomNumber: "101", sharingType: "4 Sharing",
    bedName: "Cot C1 · Lower", bedCode: "BED101C1-L", bedType: "Double Cot (Bunk)", cotCode: "C1", berthPosition: "LOWER", bedImage: luxuryBedImage,
    status: "Available", currentResident: "", bookingId: "", checkInDate: "", checkOutDate: "", description: "Lower berth of double cot C1."
  },
  {
    id: "anna-102-bed-a",
    branchId: "anna-nagar",
    branchName: "Anna Nagar",
    roomId: "anna-102",
    roomNumber: "102",
    sharingType: "3 Sharing",
    bedName: "Bed A",
    bedCode: "BED102A",
    bedType: "Single Cot",
    bedImage: luxuryBedImage,
    status: "Available",
    currentResident: "",
    bookingId: "",
    checkInDate: "",
    checkOutDate: "",
    description: "Front cot in a spacious three sharing room."
  },
  {
    id: "anna-102-c1-upper", branchId: "anna-nagar", branchName: "Anna Nagar", roomId: "anna-102", roomNumber: "102", sharingType: "3 Sharing",
    bedName: "Cot C1 · Upper", bedCode: "BED102C1-U", bedType: "Double Cot (Bunk)", cotCode: "C1", berthPosition: "UPPER", bedImage: luxuryBedImage,
    status: "Occupied", currentResident: "Naveen Raj", bookingId: "BK-AN-102B", checkInDate: "2026-05-12", checkOutDate: "2027-05-11",
    description: "Upper berth of double cot C1 assigned to an active resident."
  },
  {
    id: "anna-102-c1-lower", branchId: "anna-nagar", branchName: "Anna Nagar", roomId: "anna-102", roomNumber: "102", sharingType: "3 Sharing",
    bedName: "Cot C1 · Lower", bedCode: "BED102C1-L", bedType: "Double Cot (Bunk)", cotCode: "C1", berthPosition: "LOWER", bedImage: luxuryBedImage,
    status: "Available", currentResident: "", bookingId: "", checkInDate: "", checkOutDate: "",
    description: "Lower berth of double cot C1."
  },
  {
    id: "viru-101-c2-upper", branchId: "virugambakkam", branchName: "Virugambakkam", roomId: "viru-101", roomNumber: "101", sharingType: "4 Sharing",
    bedName: "Cot C2 · Upper", bedCode: "BEDV101C2-U", bedType: "Double Cot (Bunk)", cotCode: "C2", berthPosition: "UPPER", bedImage: luxuryBedImage,
    status: "Reserved", currentResident: "", bookingId: "BK-VR-101B", checkInDate: "2026-08-01", checkOutDate: "2027-07-31",
    description: "Upper berth of double cot C2 reserved for upcoming move-in."
  },
  {
    id: "viru-101-c2-lower", branchId: "virugambakkam", branchName: "Virugambakkam", roomId: "viru-101", roomNumber: "101", sharingType: "4 Sharing",
    bedName: "Cot C2 · Lower", bedCode: "BEDV101C2-L", bedType: "Double Cot (Bunk)", cotCode: "C2", berthPosition: "LOWER", bedImage: luxuryBedImage,
    status: "Available", currentResident: "", bookingId: "", checkInDate: "", checkOutDate: "",
    description: "Lower berth of double cot C2."
  },
  {
    id: "viru-101-c1-upper",
    branchId: "virugambakkam",
    branchName: "Virugambakkam",
    roomId: "viru-101",
    roomNumber: "101",
    sharingType: "4 Sharing",
    bedName: "Cot C1 · Upper",
    bedCode: "BEDV101C1-U",
    bedType: "Double Cot (Bunk)",
    cotCode: "C1",
    berthPosition: "UPPER",
    bedImage: luxuryBedImage,
    status: "Available",
    currentResident: "",
    bookingId: "",
    checkInDate: "",
    checkOutDate: "",
    description: "Upper berth of double cot C1."
  },
  {
    id: "viru-101-c1-lower",
    branchId: "virugambakkam",
    branchName: "Virugambakkam",
    roomId: "viru-101",
    roomNumber: "101",
    sharingType: "4 Sharing",
    bedName: "Cot C1 · Lower",
    bedCode: "BEDV101C1-L",
    bedType: "Double Cot (Bunk)",
    cotCode: "C1",
    berthPosition: "LOWER",
    bedImage: luxuryBedImage,
    status: "Available",
    currentResident: "",
    bookingId: "",
    checkInDate: "",
    checkOutDate: "",
    description: "Lower berth of double cot C1."
  },
  {
    id: "viru-102-bed-a",
    branchId: "virugambakkam",
    branchName: "Virugambakkam",
    roomId: "viru-102",
    roomNumber: "102",
    sharingType: "3 Sharing",
    bedName: "Bed A",
    bedCode: "BEDV102A",
    bedType: "Single Cot",
    bedImage: luxuryBedImage,
    status: "Available",
    currentResident: "",
    bookingId: "",
    checkInDate: "",
    checkOutDate: "",
    description: "Single cot in Room 102."
  },
  {
    id: "viru-102-c1-upper",
    branchId: "virugambakkam",
    branchName: "Virugambakkam",
    roomId: "viru-102",
    roomNumber: "102",
    sharingType: "3 Sharing",
    bedName: "Cot C1 · Upper",
    bedCode: "BEDV102C1-U",
    bedType: "Double Cot (Bunk)",
    cotCode: "C1",
    berthPosition: "UPPER",
    bedImage: luxuryBedImage,
    status: "Reserved",
    currentResident: "",
    bookingId: "BK-VR-102C1U",
    checkInDate: "2026-08-01",
    checkOutDate: "",
    description: "Upper berth of double cot C1."
  },
  {
    id: "viru-102-c1-lower",
    branchId: "virugambakkam",
    branchName: "Virugambakkam",
    roomId: "viru-102",
    roomNumber: "102",
    sharingType: "3 Sharing",
    bedName: "Cot C1 · Lower",
    bedCode: "BEDV102C1-L",
    bedType: "Double Cot (Bunk)",
    cotCode: "C1",
    berthPosition: "LOWER",
    bedImage: luxuryBedImage,
    status: "Available",
    currentResident: "",
    bookingId: "",
    checkInDate: "",
    checkOutDate: "",
    description: "Lower berth of double cot C1."
  },
].filter((bed) => isLaunchBranchId(bed.branchId));

const sharingTypeByBerthCount = { 1: "1 Sharing", 2: "2 Sharing", 3: "3 Sharing", 4: "4 Sharing" };

const syncBedSharingTypes = (beds) => {
  const counts = {};
  beds.forEach((bed) => {
    counts[bed.roomId] = (counts[bed.roomId] || 0) + 1;
  });
  return beds.map((bed) => {
    const sharingType = sharingTypeByBerthCount[counts[bed.roomId]];
    return sharingType && sharingType !== bed.sharingType ? { ...bed, sharingType } : bed;
  });
};

const staleBedIds = new Set(["anna-101-bed-a", "anna-101-bed-b", "anna-102-bed-b", "anna-102-bed-c", "viru-101-bed-a", "viru-101-bed-b"]);

export const loadBeds = () => {
  const stored = localStorage.getItem(BED_STORAGE_KEY);
  const source = stored ? JSON.parse(stored) : defaultBeds;
  const requiredDemoBeds = defaultBeds.filter((bed) => ["anna-101", "anna-102", "viru-101", "viru-102"].includes(bed.roomId));
  const sourceWithDoubleCotBeds = [...source, ...requiredDemoBeds.filter((bed) => !source.some((item) => item.id === bed.id))];
  const cleaned = sourceWithDoubleCotBeds.filter((bed) => !staleBedIds.has(bed.id));
  const scoped = cleaned.filter((bed) => isLaunchBranchId(bed.branchId));
  const synced = syncBedSharingTypes(scoped);
  if (stored && JSON.stringify(synced) !== JSON.stringify(source)) localStorage.setItem(BED_STORAGE_KEY, JSON.stringify(synced));
  return synced;
};

export const saveBeds = (beds) => {
  registerLaunchBranchIds(beds.map((bed) => bed && bed.branchId));
  const scopedBeds = beds.filter((bed) => isLaunchBranchId(bed.branchId));
  localStorage.setItem(BED_STORAGE_KEY, JSON.stringify(scopedBeds));
  window.dispatchEvent(new CustomEvent("pg:beds-updated", { detail: { beds: scopedBeds } }));
};
