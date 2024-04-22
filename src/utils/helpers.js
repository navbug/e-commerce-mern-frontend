export const adminIds = ["6625f5b8bba83b7de30ea679"];

export const Logo = "/src/assets/logo_e.png";

export const categories = [
  {
    title: "Earbuds",
    pseudoName: "earbuds",
    image: "https://www.boat-lifestyle.com/cdn/shop/products/black_5459f3fb-22a2-41ab-895f-944e00c89837_800x.png?v=1685518054",
  },
  {
    title: "Headphones",
    pseudoName: "headphones",
    image: "https://www.boat-lifestyle.com/cdn/shop/products/main3_b6563f96-f1a1-4915-b686-d4e37232ec3c_600x.png?v=1685707922",
  },
  {
    title: "Wireless Speakers",
    pseudoName: "speakers",
    image: "https://www.boat-lifestyle.com/cdn/shop/products/1200f_main3_600x.png?v=1673002201",
  },
  {
    title: "Neckbands",
    pseudoName: "neckbands",
    image: "https://www.boat-lifestyle.com/cdn/shop/products/245v2_main_5_600x.png?v=1655787246",
  },
  {
    title: "Soundbars",
    pseudoName: "soundbars",
    image: "https://www.boat-lifestyle.com/cdn/shop/files/AB4100DA_MainImage_600x.png?v=1693895962",
  },
  {
    title: "Party Speakers",
    pseudoName: "party speakers",
    image: "https://www.boat-lifestyle.com/cdn/shop/products/main-im_1600x.png?v=1659552506",
  }
];

export function numWithCommas(number) {
  number = number.toString();
  number = number.split(".");
  return number[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + (number[1] ? ("."+number[1]): "");
};

export const sortOptions = [
  {
    name: "Featured",
    active: true,
    icon: "FaSort",
  },
  {
    name: "Lowest Price",
    active: false,
    icon: "FaSort",
  },
  {
    name: "Highest Price",
    active: false,
    icon: "FaSort",
  },
  {
    name: "Alphabetically A-Z",
    active: false,
    icon: "FaSort",
  },
  {
    name: "Alphabetically Z-A",
    active: false,
    icon: "FaSort",
  }
];

export const calculateAverageRating =  (reviews) => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
}