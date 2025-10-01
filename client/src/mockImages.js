const mockImages = [
  {
    id: 1,
    title: "modernLivingRoom",
    description: "modernLivingRoom",
    category: "designed",
    room: "livingRoom", // Changed from "modern" to match category value
    url: "1.jpg",
  },
  {
    id: 2,
    title: "officeInterior",
    description: "officeInterior",
    category: "designed_implemented",
    room: "office", // This already matches
    url: "2.jpg",
  },
  {
    id: 3,
    title: "kitchenRemodel",
    description: "kitchenRemodel",
    category: "designed",
    room: "kitchen", // This already matches
    url: "3.jpg",
  },
  {
    id: 4,
    title: "luxuryBedroom",
    description: "luxuryBedroom",
    category: "designed_implemented",
    room: "bedroom", // Changed from "luxury" to match "bedroom" category
    url: "4.jpg",
  }, 
];

export default mockImages;