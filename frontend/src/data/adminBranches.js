import { isLaunchBranchId, registerLaunchBranchIds } from "./launchScope";

export const BRANCH_STORAGE_KEY = "pg_admin_branches";

const DEFAULT_AREAS = ["Anna Nagar", "Virugambakkam"];

const readPersistedAreas = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(BRANCH_STORAGE_KEY));
    if (Array.isArray(stored)) {
      const areas = [...new Set(stored.map((branch) => branch && branch.area).filter(Boolean))];
      if (areas.length) return areas;
    }
  } catch (error) {
    // Ignore malformed stored value and fall back to defaults.
  }
  return DEFAULT_AREAS;
};

export let AREAS = readPersistedAreas();

export const refreshAreas = (branches) => {
  const areas = branches && branches.length
    ? [...new Set(branches.map((branch) => branch && branch.area).filter(Boolean))]
    : readPersistedAreas();
  AREAS = areas.length ? areas : DEFAULT_AREAS;
};

export const CHENNAI_AREAS = [
  "Adyar",
  "Ambattur",
  "Aminjikarai",
  "Anna Nagar",
  "Ashok Nagar",
  "Avadi",
  "Besant Nagar",
  "Choolaimedu",
  "Chromepet",
  "ECR (East Coast Road)",
  "Egmore",
  "Guindy",
  "Kilpauk",
  "Kodambakkam",
  "Kolathur",
  "Korattur",
  "Koyambedu",
  "Madipakkam",
  "Maduravoyal",
  "Manapakkam",
  "Medavakkam",
  "Mogappair",
  "Mylapore",
  "Nandanam",
  "Nungambakkam",
  "OMR (Old Mahabalipuram Road)",
  "Pallavaram",
  "Pallikaranai",
  "Pammal",
  "Perambur",
  "Poonamallee",
  "Porur",
  "Royapettah",
  "Saidapet",
  "Saligramam",
  "Sholinganallur",
  "Siruseri",
  "T Nagar",
  "Tambaram",
  "Teynampet",
  "Thiruvanmiyur",
  "Tondiarpet",
  "Valasaravakkam",
  "Velachery",
  "Villivakkam",
  "Virugambakkam",
  "West Mambalam"
];

export const AMENITIES = [
  "WiFi",
  "Healthy Food",
  "Laundry",
  "Housekeeping",
  "Power Backup",
  "RO Water",
  "CCTV",
  "Biometric Entry",
  "Parking",
  "Lift"
];

export const AMENITY_STORAGE_KEY = "pg_admin_amenities";

export const GALLERY_LABELS = ["Building Front", "Reception", "Room", "Washroom", "Dining Area", "Terrace"];

const imageUrl = (photoId, width = 900) => `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=82`;

// source.unsplash.com/featured was retired and returns 404 in production. Use
// stable image URLs from the supported images.unsplash.com host instead.
const GALLERY_PHOTO_IDS = [
  "photo-1545324418-cc1a3fa10c00",
  "photo-1600210492486-724fe5c67fb0",
  "photo-1524758631624-e2822e304c36",
  "photo-1584622650111-993a426fbf0a",
  "photo-1556911220-bff31c812dba",
  "photo-1505693416388-ac5ce068fe85"
];

const buildGallery = (photoOffset = 0) =>
  GALLERY_LABELS.map((label, index) => ({
    label,
    image: imageUrl(GALLERY_PHOTO_IDS[(index + photoOffset) % GALLERY_PHOTO_IDS.length])
  }));

export const branchImageSets = {
  "anna-nagar": {
    image: imageUrl("photo-1545324418-cc1a3fa10c00"),
    gallery: buildGallery()
  },
  virugambakkam: {
    image: imageUrl("photo-1486406146926-c627a92ad1ab"),
    gallery: buildGallery(2)
  }
};

export const defaultBranches = [
  {
    id: "anna-nagar",
    name: "Mom's Care PG House - Anna Nagar",
    code: "PG-ANN-001",
    area: "Anna Nagar",
    address: "12, 2nd Avenue, Anna Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    contactNumber: "9876543210",
    email: "annanagar@momscarepg.com",
    mapLink: "https://maps.google.com/?q=Anna+Nagar+Chennai",
    latitude: "13.0850",
    longitude: "80.2101",
    image: branchImageSets["anna-nagar"].image,
    gallery: branchImageSets["anna-nagar"].gallery,
    description: "Premium branch close to metro access, shopping streets, and coaching hubs.",
    gender: "Girls",
    status: "Active",
    amenities: ["WiFi", "Healthy Food", "Laundry", "Housekeeping", "Power Backup", "RO Water", "CCTV", "Biometric Entry", "Lift"],
    rooms: 50,
    beds: 200,
    occupiedBeds: 148,
    availableBeds: 42,
    reservedBeds: 6,
    maintenanceBeds: 4,
    monthlyRevenue: 1245000,
    todayCollection: 18000,
    pendingRent: 120000,
    overduePayments: 12,
    occupancy: 74,
    wardens: ["Priya Raman", "S. Kavitha"],
    residents: 148
  },
  {
    id: "virugambakkam",
    name: "Mom's Care PG House - Virugambakkam",
    code: "PG-VIR-002",
    area: "Virugambakkam",
    address: "44, Arcot Road, Virugambakkam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600092",
    contactNumber: "9876543211",
    email: "virugambakkam@momscarepg.com",
    mapLink: "https://maps.google.com/?q=Virugambakkam+Chennai",
    latitude: "13.0486",
    longitude: "80.1928",
    image: branchImageSets.virugambakkam.image,
    gallery: branchImageSets.virugambakkam.gallery,
    description: "Well connected PG for working professionals around Kodambakkam and Vadapalani.",
    gender: "Girls",
    status: "Active",
    amenities: ["WiFi", "Healthy Food", "Laundry", "RO Water", "CCTV", "Biometric Entry", "Parking"],
    rooms: 22,
    beds: 88,
    occupiedBeds: 69,
    availableBeds: 19,
    wardens: ["Nandhini S."],
    residents: 69
  }
].filter((branch) => isLaunchBranchId(branch.id));

const normalizeAmenityLabel = (amenity) => (amenity === "Food" ? "Healthy Food" : amenity);

const normalizeBranchAmenities = (branch) => ({
  ...branch,
  amenities: [...new Set((branch.amenities || []).map(normalizeAmenityLabel))]
});

const isLegacyImage = (image) => !image || image.includes("photo-1560448204-e02f11c3d0e2");

const normalizeGallery = (branch) => {
  const defaultGallery = branchImageSets[branch.id]?.gallery || [];
  if (!Array.isArray(branch.gallery) || branch.gallery.length < GALLERY_LABELS.length) return defaultGallery;
  if (branch.gallery.some((item) => typeof item === "string" && isLegacyImage(item))) return defaultGallery;

  return GALLERY_LABELS.map((label, index) => {
    const item = branch.gallery[index];
    return typeof item === "string" ? { label, image: item } : { label: item?.label || label, image: item?.image || "" };
  });
};

const normalizeBranchImages = (branch) => ({
  ...branch,
  image: isLegacyImage(branch.image) ? branchImageSets[branch.id]?.image || "" : branch.image,
  gallery: normalizeGallery(branch)
});

export const loadBranches = () => {
  const stored = localStorage.getItem(BRANCH_STORAGE_KEY);
  const source = stored ? JSON.parse(stored) : defaultBranches;
  const scoped = source
    .filter((branch) => isLaunchBranchId(branch.id))
    .map((branch) => ({ ...branch, gender: "Girls" }));
  if (stored && JSON.stringify(scoped) !== JSON.stringify(source)) localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(scoped));
  refreshAreas(scoped);
  return scoped.map((branch) => normalizeBranchImages(normalizeBranchAmenities(branch)));
};

export const saveBranches = (branches) => {
  registerLaunchBranchIds(branches.map((branch) => branch && branch.id));
  const scopedBranches = branches.filter((branch) => isLaunchBranchId(branch.id));
  localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(scopedBranches));
  refreshAreas(scopedBranches);
  window.dispatchEvent(new CustomEvent("pg:branches-updated", { detail: { branches: scopedBranches } }));
};

export const loadAmenities = () => {
  const stored = localStorage.getItem(AMENITY_STORAGE_KEY);
  return [...new Set((stored ? JSON.parse(stored) : AMENITIES).map(normalizeAmenityLabel))];
};

export const saveAmenities = (amenities) => {
  localStorage.setItem(AMENITY_STORAGE_KEY, JSON.stringify(amenities));
};
