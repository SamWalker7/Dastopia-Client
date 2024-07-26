import {getDownloadUrl} from "../api/index"

export const CAR_DATA = []

export const CAR = [
  [
    {
      name: "Toyota Corolla",
      price: "2,500",
      img: "631425ed-b591-4bec-b53f-d5e205b969c7/images/image-0-324",
      model: "Yaris",
      mark: "Toyota",
      year: "2010",
      doors: "4/5",
      air: "Yes",
      transmission: "Automatic",
      fuel: "Gasoline",
    },
  ],
  [
    {
      name: "Suzuki Swift",
      price: "3,000",
      img:"af32e467-2121-4efb-8fe3-c5411284eadd/images/image-0-533",
      model: "Suzuki",
      mark: "Swift",
      year: "2021",
      doors: "4/5",
      air: "Yes",
      transmission: "Automatic",
      fuel: "Gasoline",
    },
  ],
  [
    {
      name: "Hyundai i10",
      price: "3,500",
      img: "10cb9a15-06a9-4b22-a780-02564e7a690f/images/image-0-440",
      model: "Hyundai",
      mark: "i10",
      year: "2020",
      doors: "4/5",
      air: "Yes",
      transmission: "Manual",
      fuel: "Gasoline",
    },
  ],
  [
    {
      name: "Suzuki Dzire",
      price: "3,0000",
      img: "77006cd1-3b1c-424b-b38d-391f7cb69dbf/images/image-0-45",
      model: "Dzire",
      mark: "Suzuki",
      year: "2022",
      doors: "4/5",
      air: "Yes",
      transmission: "Automatic",
      fuel: "Gasoline",
    },
  ],
  [
    {
      name: "Toyoya Yaris",
      price: "2,500",
      img: "8bd2b24d-dc31-4f2f-861c-436d07297c6d/images/image-0-737",
      model: "Corolla",
      mark: "Toyota",
      year: "2007",
      doors: "4/5",
      air: "Yes",
      transmission: "Automatic",
      fuel: "Gasoline",
    },
  ],
  [
    {
      name: "Suzuki Celerio",
      price: "2,500",
      img: "ea7fdb0f-1895-4ada-bfc3-3b3c4dc82a69/images/image-0-587",
      model: "Celerio",
      mark: "Suzuki",
      year: "2022",
      doors: "4/5",
      air: "Yes",
      transmission: "Automatic",
      fuel: "Gasoline",
    },
  ],
];


export const fetchCarData = async () => {
  const result = await Promise.all(
    CAR.map(async (c) => {
      try {
        const data = await getDownloadUrl(c[0].img);
        return [{
          ...c[0],
          img: data.body || "https://via.placeholder.com/300"
        }];
      } catch (e) {
        console.log("error while fetching image", e);
        return null;
      }
    })
  );

  
  const filteredResult = result.filter(item => item !== null);
  console.log(filteredResult, "result");
  return filteredResult;
};
