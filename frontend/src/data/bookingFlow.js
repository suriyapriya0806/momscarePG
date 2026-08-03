import { useEffect, useMemo, useState } from "react";
import { loadBranches } from "./adminBranches";
import { loadRooms } from "./adminRooms";
import { loadBeds } from "./adminBeds";
import { AVAILABILITY_EVENT } from "../lib/liveAvailability";

export const publicBranchIdFromAdminBranchId = (branchId) => `${branchId}-pg`;
export const adminBranchIdFromPublicBranchId = (branchId) => String(branchId || "").replace(/-pg$/, "");

const branchExtras = {
  "anna-nagar": { rating: "4.9" },
  virugambakkam: { rating: "4.8" }
};

const bookingAmountBySharingType = {
  "1 Sharing": 5000,
  "2 Sharing": 3000,
  "3 Sharing": 2500,
  "4 Sharing": 2000
};

export const isValidMoveInDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));

export const withMoveInParam = (path, moveIn) => {
  if (!isValidMoveInDate(moveIn)) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}moveIn=${encodeURIComponent(moveIn)}`;
};

const isDateInRange = (date, start, end) => (
  Boolean(start) && date >= start && (!end || date <= end)
);

export const isBedAvailableOnDate = (bed, moveIn) => {
  if (!isValidMoveInDate(moveIn)) return false;
  if (bed.status === "Maintenance") return false;

  const checkInDate = bed.checkInDate || "";
  const checkOutDate = bed.checkOutDate || "";
  const conflictsWithDateRange = isDateInRange(moveIn, checkInDate, checkOutDate);

  if (bed.status === "Available") return !conflictsWithDateRange;
  if (["Reserved", "Occupied"].includes(bed.status)) {
    if (!checkInDate) return false;
    return !conflictsWithDateRange && moveIn < checkInDate;
  }

  return false;
};

export const availabilityStatusForDate = (bed, moveIn) => (
  isBedAvailableOnDate(bed, moveIn) ? "Available" : bed.status === "Maintenance" ? "Maintenance" : "Reserved"
);

export const roomAvailabilityForDate = (room, moveIn) => {
  const bedList = (room.bedList || []).map((bed) => ({
    ...bed,
    status: availabilityStatusForDate(bed, moveIn)
  }));
  const availableBeds = bedList.filter((bed) => bed.status === "Available").length;
  return {
    ...room,
    bedList,
    availableBedsForMoveIn: availableBeds,
    status: availableBeds > 0 ? "Available" : "Not Available"
  };
};

const toAddressLines = (address) =>
  String(address || "").split(",").map((line) => line.trim()).filter(Boolean);

const toExploreBranch = (adminBranch, adminRooms) => {
  const branchRooms = adminRooms.filter((room) => room.branchId === adminBranch.id);
  const prices = branchRooms.map((room) => Number(room.monthlyRent || 0)).filter(Boolean);
  const startingPrice = prices.length ? Math.min(...prices) : Number(adminBranch.startingPrice || 0);
  const occupancy = branchRooms.length
    ? {
        totalRooms: branchRooms.length,
        bookedRooms: branchRooms.filter((room) => room.status !== "Available").length,
        availableRooms: branchRooms.filter((room) => room.status === "Available").length
      }
    : {
        totalRooms: Number(adminBranch.rooms || 0),
        bookedRooms: Number(adminBranch.occupiedBeds || 0),
        availableRooms: Number(adminBranch.availableBeds || 0)
      };
  const latitude = Number(adminBranch.latitude) || 13.0827;
  const longitude = Number(adminBranch.longitude) || 80.2707;
  const addressLines = toAddressLines(adminBranch.address);

  return {
    id: publicBranchIdFromAdminBranchId(adminBranch.id),
    name: adminBranch.name,
    area: adminBranch.area,
    addressLines: addressLines.length ? addressLines : [adminBranch.area || adminBranch.name],
    startingPrice,
    rating: branchExtras[adminBranch.id]?.rating || "4.8",
    contactNumber: adminBranch.contactNumber,
    latitude,
    longitude,
    fullAddress: addressLines.join(",\n"),
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    image: adminBranch.image,
    gallery: (adminBranch.gallery || []).map((item) => (typeof item === "string" ? item : item?.image)).filter(Boolean),
    facilities: adminBranch.amenities || [],
    occupancy
  };
};

const toGuestBed = (bed) =>
  bed.bedType === "Double Cot (Bunk)" && bed.cotCode
    ? {
        id: bed.id,
        label: bed.bedName || `Cot ${bed.cotCode} · ${bed.berthPosition === "UPPER" ? "Upper" : "Lower"}`,
        cotCode: bed.cotCode,
        berthPosition: bed.berthPosition || "LOWER",
        status: bed.status,
        checkInDate: bed.checkInDate || "",
        checkOutDate: bed.checkOutDate || ""
      }
    : { id: bed.id, label: bed.bedName || "Bed", status: bed.status, checkInDate: bed.checkInDate || "", checkOutDate: bed.checkOutDate || "" };

const toGuestRoom = (adminRoom, adminBeds) => {
  const roomBeds = adminBeds.filter((bed) => bed.roomId === adminRoom.id);
  // Rooms can be added before individual bed records are configured in the
  // admin panel.  Keep those rooms bookable by displaying a temporary layout
  // based on their configured capacity. BookingDetails turns the selected
  // temporary bed into a persisted bed record when the booking is submitted.
  const bedList = roomBeds.length
    ? roomBeds.map(toGuestBed)
    : buildDefaultRoomBeds(adminRoom.branchId, adminRoom.roomNumber, adminRoom.sharingType, Number(adminRoom.beds || 0));
  return {
    id: adminRoom.id,
    branchId: publicBranchIdFromAdminBranchId(adminRoom.branchId),
    number: adminRoom.roomNumber,
    sharingType: adminRoom.sharingType,
    roomType: adminRoom.roomType,
    beds: Number(adminRoom.beds || roomBeds.length || 0),
    status: adminRoom.status || "Available",
    monthlyRent: Number(adminRoom.monthlyRent || 0),
    securityDeposit: Number(adminRoom.securityDeposit || 0),
    bookingAmount: bookingAmountBySharingType[adminRoom.sharingType] || 5000,
    bedList
  };
};

const buildDefaultRoomBeds = (prefix, roomNumber, sharingType, bedCount) => {
  if (sharingType === "1 Sharing") {
    return [{ id: `${prefix}-${roomNumber}-a`, label: "Bed A", status: "Available" }];
  }

  const beds = [];
  let remaining = bedCount;
  if (remaining % 2 === 1) {
    beds.push({ id: `${prefix}-${roomNumber}-a`, label: "Bed A", status: "Available" });
    remaining -= 1;
  }

  let cotIndex = 1;
  while (remaining > 0) {
    beds.push({
      id: `${prefix}-${roomNumber}-c${cotIndex}-upper`,
      label: `Cot C${cotIndex} · Upper`,
      cotCode: `C${cotIndex}`,
      berthPosition: "UPPER",
      status: "Available"
    });
    beds.push({
      id: `${prefix}-${roomNumber}-c${cotIndex}-lower`,
      label: `Cot C${cotIndex} · Lower`,
      cotCode: `C${cotIndex}`,
      berthPosition: "LOWER",
      status: "Available"
    });
    cotIndex += 1;
    remaining -= 2;
  }

  return beds;
};

const defaultRoomTemplates = (publicBranchId) => {
  const prefix = adminBranchIdFromPublicBranchId(publicBranchId);
  const definitions = [
    { number: "101", sharingType: "1 Sharing", roomType: "AC", beds: 1, monthlyRent: 14500, securityDeposit: 32000, bookingAmount: 5000 },
    { number: "102", sharingType: "2 Sharing", roomType: "AC", beds: 2, monthlyRent: 13000, securityDeposit: 26000, bookingAmount: 3000 },
    { number: "103", sharingType: "3 Sharing", roomType: "Non AC", beds: 3, monthlyRent: 11000, securityDeposit: 22000, bookingAmount: 2500 },
    { number: "104", sharingType: "4 Sharing", roomType: "Non AC", beds: 4, monthlyRent: 9500, securityDeposit: 19000, bookingAmount: 2000 }
  ];

  return definitions.map((definition) => ({
    id: `${prefix}-${definition.number}`,
    branchId: publicBranchId,
    number: definition.number,
    sharingType: definition.sharingType,
    roomType: definition.roomType,
    beds: definition.beds,
    status: "Available",
    monthlyRent: definition.monthlyRent,
    securityDeposit: definition.securityDeposit,
    bookingAmount: definition.bookingAmount,
    bedList: buildDefaultRoomBeds(prefix, definition.number, definition.sharingType, definition.beds)
  }));
};

export const getExploreBranches = () => {
  const adminBranches = loadBranches();
  const adminRooms = loadRooms();
  return adminBranches.map((branch) => toExploreBranch(branch, adminRooms));
};

const overlayTemplateBeds = (bedList, adminBeds) =>
  bedList.map((bed) => {
    const adminBed = adminBeds.find((item) => item.id === bed.id);
    return adminBed ? { ...bed, status: adminBed.status } : bed;
  });

export const getBookingRooms = () => {
  const adminBranches = loadBranches();
  const adminRooms = loadRooms();
  const adminBeds = loadBeds();
  const branchIdsWithRooms = new Set(adminRooms.map((room) => room.branchId));

  return [
    ...adminRooms.map((room) => toGuestRoom(room, adminBeds)),
    ...adminBranches
      .filter((branch) => !branchIdsWithRooms.has(branch.id))
      .flatMap((branch) => {
        const publicId = publicBranchIdFromAdminBranchId(branch.id);
        return defaultRoomTemplates(publicId).map((room) => ({
          ...room,
          bedList: overlayTemplateBeds(room.bedList, adminBeds)
        }));
      })
  ];
};

export const usePublicBookingData = () => {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener(AVAILABILITY_EVENT, refresh);
    window.addEventListener("pg:beds-updated", refresh);
    window.addEventListener("pg:branches-updated", refresh);
    window.addEventListener("pg:launch-scope-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(AVAILABILITY_EVENT, refresh);
      window.removeEventListener("pg:beds-updated", refresh);
      window.removeEventListener("pg:branches-updated", refresh);
      window.removeEventListener("pg:launch-scope-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return useMemo(
    () => ({ branches: getExploreBranches(), rooms: getBookingRooms() }),
    [version]
  );
};

export const findRoomBed = (bedList, bedId) => {
  for (const item of bedList || []) {
    if (item.type === "cot") {
      const berth = item.berths.find((b) => b.id === bedId);
      if (berth) {
        return {
          ...berth,
          cotCode: item.cotCode,
          berthPosition: berth.berth_type === "upper" ? "UPPER" : "LOWER",
          bedType: "DOUBLE_COT"
        };
      }
    } else if (item.id === bedId) {
      return { ...item };
    }
  }
  return null;
};

export const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;
