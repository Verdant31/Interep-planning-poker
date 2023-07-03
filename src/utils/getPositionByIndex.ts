export const getPositionByIndex = (index: number) => {
  const positions = [
    { left: 0 },
    { left: 150, bottom: 102 },
    { right: 150, bottom: 102 },
    { right: 0, top: 0 },
    { right: 150, top: 100 },
    { left: 150, top: 100 },
  ];
  return positions[index];
};
