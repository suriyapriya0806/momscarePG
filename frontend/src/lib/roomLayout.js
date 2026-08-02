const berthPositionOf = (berth) => berth.berthPosition || (berth.berth_type === "upper" ? "UPPER" : "LOWER");

const sortBerths = (berths) =>
  [...berths].sort((a, b) => (berthPositionOf(a) === "UPPER" ? -1 : 1) - (berthPositionOf(b) === "UPPER" ? -1 : 1));

const normalizeFurniture = (beds) => {
  const items = [];
  beds.forEach((bed) => {
    if (bed.type === "cot") {
      items.push({
        kind: "cot",
        cotCode: bed.cotCode,
        label: bed.label || `Cot ${bed.cotCode}`,
        berths: bed.berths.map((berth) => ({
          ...berth,
          cotCode: bed.cotCode,
          berthPosition: berthPositionOf(berth)
        }))
      });
      return;
    }
    if (bed.cotCode) {
      const existing = items.find((item) => item.kind === "cot" && item.cotCode === bed.cotCode);
      const berth = { ...bed, cotCode: bed.cotCode, berthPosition: bed.berthPosition };
      if (existing) existing.berths.push(berth);
      else items.push({ kind: "cot", cotCode: bed.cotCode, label: `Cot ${bed.cotCode}`, berths: [berth] });
      return;
    }
    items.push({ kind: "single", bed: { ...bed } });
  });
  return items;
};

export const buildRoomLayout = (beds) => {
  const items = normalizeFurniture(beds || []).map((item) =>
    item.kind === "cot" ? { ...item, berths: sortBerths(item.berths) } : item
  );
  const rows = [];
  let index = 0;

  for (let i = 0; i < items.length; i += 2) {
    const chunk = items.slice(i, i + 2);
    rows.push({
      id: `row-${rows.length + 1}`,
      items: chunk.map((item, j) => ({
        ...item,
        position: chunk.length === 1 ? "center" : j === 0 ? "left" : "right",
        index: index++
      }))
    });
  }

  return rows;
};
