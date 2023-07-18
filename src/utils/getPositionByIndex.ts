export const getPositionByIndex = (index: number, totalLength: number) => {
  const positions = [
    { left: 0 },
    { left: totalLength > 6 ? 200 : 150, bottom: 102 },
    { right: totalLength > 6 ? 180 : 150, bottom: 102 },
    { right: 0, top: 0 },
    { right: 150, top: 100 },
    { left: 150, top: 100 },
    { left: -0, bottom: 50 },
    { right: 0, bottom: 45 },
  ];
  return positions[index];
};
