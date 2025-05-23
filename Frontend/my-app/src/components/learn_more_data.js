// learnMoreData.js
import masterBedroomImage from '../images/master_bedroom.jpeg';
import childrensBedroomImage from '../images/childrens_bedroom.jpeg';
import miniBedroomImage from '../images/mini_bedroom.jpeg';
import outsideKitchenImage from '../images/outside_kitchen.jpeg';

const learnMoreSections = [
    {
      key: 'master_bedroom',
      title: "Master Bedroom",
      description: "Experience luxury in our spacious master bedroom...",
      features: [
        { title: "Spacious Layout", desc: "Generous space with modern furniture" },
        { title: "Premium Amenities", desc: "High-quality bedding and furnishings" },
        { title: "Private Bathroom", desc: "En-suite bathroom with modern fixtures" },
      ],
      image: [
        { src: masterBedroomImage, alt: 'Master Bedroom' },
        { src: masterBedroomImage, alt: 'Master Bedroom' },
        { src: masterBedroomImage, alt: 'Master Bedroom' },
      ],
    },
    {
      key: 'childrens_bedroom',
      title: "Children's Bedroom",
      description: "A safe and fun environment designed specifically for children...",
      features: [
        { title: "Child-Friendly", desc: "Safe and comfortable for all ages" },
        { title: "Play Area", desc: "Dedicated space for activities" },
        { title: "Storage Solutions", desc: "Ample space for toys and clothes" },
      ],
      image: [
        { src: childrensBedroomImage, alt: 'Childrens Bedroom' },
        { src: childrensBedroomImage, alt: 'Childrens Bedroom' },
        { src: childrensBedroomImage, alt: 'Childrens Bedroom' },
      ],
    },
    {
      key: 'mini_bedroom',
      title: "Mini Bedroom",
      description: "Our cozy mini bedroom offers comfort and functionality...",
      features: [
        { title: "Compact Design", desc: "Efficient use of space" },
        { title: "Essential Amenities", desc: "All necessary comforts included" },
        { title: "Modern Decor", desc: "Contemporary style and comfort" },
      ],
      image: [
        { src: miniBedroomImage, alt: 'Mini Bedroom' },
        { src: miniBedroomImage, alt: 'Mini Bedroom' },
        { src: miniBedroomImage, alt: 'Mini Bedroom' },
      ],
    },
    {
      key: 'outside_kitchen',
      title: "Outside Kitchen",
      description: "Enjoy cooking in our well-equipped outdoor kitchen...",
      features: [
        { title: "Modern Appliances", desc: "High-quality cooking equipment" },
        { title: "Dining Area", desc: "Comfortable outdoor seating" },
        { title: "Scenic Views", desc: "Beautiful surroundings while cooking" },
      ],
      image: [
        { src: outsideKitchenImage, alt: 'Outside Kitchen' },
        { src: outsideKitchenImage, alt: 'Outside Kitchen' },
        { src: outsideKitchenImage, alt: 'Outside Kitchen' },
      ],
    },
  ];
  
  export default learnMoreSections;
  