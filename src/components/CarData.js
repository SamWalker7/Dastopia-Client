import Golf6 from "../images/cars-big/golf6.jpg";
import AudiA1 from "../images/cars-big/audia1.jpg";
import Toyota from "../images/cars-big/toyotacamry.jpg";
import Bmw320 from "../images/cars-big/bmw320.jpg";
import Benz from "../images/cars-big/benz.jpg";
import Passat from "../images/cars-big/passatcc.jpg";

export const CAR_DATA = [
  [
    {
      name: "Toyota Corolla",
      price: "2,500",
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/8bd2b24d-dc31-4f2f-861c-436d07297c6d/images/image-0-737?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD2WPJEKREJ%2F20240724%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240724T101532Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIC4FkNBdwV2RfjixtQxWuZ%2FIXG9MiJ3ej3rzaitDkggMAiBpgaFKFeCgu15gM58VPcObXLYRpP5kKiPnDQCKECClJirzAgij%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDkwNTQxODE3ODgwNSIMohr4n6iCVh%2B6b1%2BQKscCa8gOOU4c2kxQU0dPqQ2%2BhvCvlYEcRxWjb5zgybzWbA7AlkK1U7pIGyOJw8ZTGSPrQiP1khL6MKNuzDJ6gzdAI43HvuHJ6xnPBE2skrwaOcBBVUaa57a1xDwEg6cWO8G05rSPMqsJaZl7l3Lj%2Bm1gI%2FKSumcaa7oabfK9mZ1dFm5EM2jsF3dhpA5wBDRQo8jsykKgLZGkx1%2Fq3%2B0zBY2zTo21L4Klo3TAYXo04hg9D3ihqqaehtfIsPyCCPWrsEaZwvEMwKImNH9SJ11wROGF20WTAGQfkHBqFO6%2FW9L0E9NErtDG4l8r82kbGVyQ66B%2BctuFLtqMaGtPR%2BVAh6U2b7O1YXcjy7sqGjXAda6ysN1zx3Bg36ihB%2BO84G4qzyrx0w0UpnkzbXbTecaAySrB3YelQj8YlrA9FwXsEJMKBrykVBXHYopbMMOog7UGOp8Bi6Dt8h0T6EIwqEPQSPI55sJSG8Ro61lnbVVSATelaHt5fyeq7TbS6EZjcDFHZ%2F1c%2FgafDc07FNpiH7VUVnrplnnBYAxJ%2BiLcFrlvAh79uasRoaCWwEUZyOtXUALDgiYkYOhoSjmXi%2BH9Y14r9hviv0VYHf6k97hdB%2FfLnznyMdd0eRo2sFmVP1dRLPXjphqdB4HzLIDL%2FTgTK7w8emxj&X-Amz-Signature=b14b5f55ab2bddc3de9c35a4bb7b4b7cac63a02d2672521422667ed1ef6af055&X-Amz-SignedHeaders=host&x-id=GetObject",
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
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/af32e467-2121-4efb-8fe3-c5411284eadd/images/image-0-533?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD2SPAQEXAM%2F20240724%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240724T105332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIFq6xACWz9KlJ00WcJNPaf9ifryBXDyItCMZdyE4YXvLAiBVZKsepfj%2FtHklHjyIGP2C%2BGzTpDKs1NQFPTkbestIHCrzAgik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDkwNTQxODE3ODgwNSIM2m2UigicvydpdHSfKscC9SFxIoFYjuwGW6w6dS0512WwzDkgVYQ8AfEuPHA7P402ERnNMtL0c0o9kOCAHXzhQB1jr%2BPGxYB%2BRRRxPe6XNzu3uXx2t63ysP3i4uggBV%2BDnazXWZTH0iuGO%2BRi3w%2FLQpWosWUdBEhODuKxToTKv3lB%2FbAs87D18VRUnLLG5RkjDvDyzAnK7JSH9X%2Bt2sCOxtg%2BufPmPPgQ1KOPeKpqJEbODkbEdTqTwEX8gNEd2yaVZujdi3rCFELaEu3o1hS%2BKo31BFvKtdOFSSfP2FbsI9NkMj6chCbR5LgDzRIGcxor5f2iGKqHDvB7Kf4xBRwS%2BU8VnESgAsv9l30gLyXDuhT%2FkomFaOocXrrExtINwdqh74JXwYipmcxMV8ZB4UhpvFrqrD7ay7mg2Qbo%2BiRlqJA2puhfIJ8htuY8aSWU%2F9FulICIeJbqMOa5g7UGOp8BKh%2FavD7Pu6jVNm75FFPUVON1%2FI6GIcbXgH3L2T0BV%2BMnZBjOWgQ8u9xCmOngGqgWKdRQpq3pZBHoweGwOuYJtGA%2FJMReupHlME04sXPRvxSnvgkBZXDfkH0WrNsfFVLFuv7aWv7bsypcD55EyRJkjRl7a59mPWrWCCuLLVqJG2vU6lVqZGZJbvBw6lI8fel4lKJNZvRaSQ2uqWKskDxv&X-Amz-Signature=d28a553912f16a79d4b1181fbdd81b08937f4a5898ca4992b551ac05a63e6eb8&X-Amz-SignedHeaders=host&x-id=GetObject"

,
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
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/10cb9a15-06a9-4b22-a780-02564e7a690f/images/image-0-440?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD2UKCPHZU3%2F20240724%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240724T105332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIGViSHLE4LbjpwluMDyYAD%2F2NBdkdon5KVYA5IIMMlZcAiEA7LXPsC8QqvEriaiSXbWLKxWAFRJOQ%2FuCz39lu%2BkTHi4q8wIIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDGvDDP3vhHKg%2F%2FhDwyrHAi7Sj3WEm88upIdDFwKSRKm87nRQ1kvW5nuo5xszeYpjEc%2B5UDfg6KfDMN89EGNpwPpO0KhTalzc189PuQ0PZRdInTFRDFD%2F3ZAqe1%2Ff6R0oc8FxvIQcZZV9nzIJ2FxabF7oRTgTrs6Dt%2BFQSmKCBFhgJN%2B1kNM7dEMCqPpjZvPPslQU7FJMlPYWDHt%2FqTLDC0qBotHkrQ7LreVk1PdhyL4TvEEAMNUNrPh8Ni4sqx1Qitj751880Tfd5eKY1jAubEPjM%2F%2B0sXm8trFtGBwiRxkJVTaVmupkGViGybtVsxwQw5gWTaFDfdPqIk2wgCXCQGQST3bJx4S654HfFNoWNWIT6RWl5ZjmyvfV7mWzCMTqMcGI7LAMrSCY6UQ0%2FygwM4G6eO5bDbnzvB2hr2st4hQKKwDO0ri3slPBF%2F7I84QyaQAsGLK2vDDmuYO1BjqeAcIA8E9RBtqCXdxBJS92fYMxNHRGMwXOyzZyDkq382Qubg7MGYVbzK%2BwN9CChCIWvbyI%2F8KGB%2B4JtvlvrzkmjtRORPvyoQOpSpp%2FEXddNmL3%2FMlOZeSEf62UU9oQTqiqxrqQKGLoxBkI%2Fez3GLefTKRhP7or%2F%2BpFJx5iXvWKOW68uXCX2wf8iRm%2FopCmI62P29BNVn%2FAN8m%2FDo4cibX4&X-Amz-Signature=b13face6d16e5acab846a6357c4cb508f184e5e22d741e2a83ee3f96b9e9cf41&X-Amz-SignedHeaders=host&x-id=GetObject",
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
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/77006cd1-3b1c-424b-b38d-391f7cb69dbf/images/image-0-45?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD2QQC5KRG4%2F20240724%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240724T101532Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQCCiJkSDCR2qlpqNAl%2BCdam%2F1KKXY79pfU7WdaXb6v92gIgeC33uhcVMByqip%2BiInTWx83evjBqyM0C8BsswIh4tB0q8wIIo%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDCLFU%2BhIhEYI6n6AUyrHAu4UIyB9IgGO%2FtC8q10L1yIucgalR%2B2utrPjv5jQMTE75bhiRemQlr%2FWiuAEk11349dl76sLI4BchMZz4UR1hKIhUnyRGldNK5BUhXy7lTQxRsKU8YP1Yp6l26xEpW1HHwEFBMOyJI%2BXwJHv%2Bz2xa0ARm6D1kZmCioOxAZ7%2Fxsugh5xwrgcEM9LEpxlk4k8rxVcnldkRwtIr2eKG2%2BCV6Ok63enJPTF1seX6R%2BCvLT0qN32b0TyvPQNJiFkfPOvvO5cjRMcjfk7cNwYGO0MGJsa4ei%2Ft%2Fu55bhVIxW2dpPs3sJ8r6v3G8%2FapWK3gyQDPomC3zwNp1qleB6mh8rXfRegUH%2FP62ycHAowE44f491uhULkHKm%2BIvc84L0YvGI%2FDY3qbroM7GMz9IFkiNB%2FF%2FhIuDWUaOUOqY3LiSn3hcjJt0TNJzMnTvjDDqIO1BjqeASn7WSU1iKmOBbYKAQC2z4qWgAJKyjf7WTs9BxefSO8oW6Agm2ZVjlYFL%2BkOoKCVkfQN7QXjyLyLu1R6QH20nyMLvfVJU3IStnocFJCElUUjaa1tTZOZvqg9KTuNO5zfTQHS3xffpnChqox5zj%2Bwoswt10Q%2FXpreB3b1BXerhdHad26GwWF3ZAlJ%2F0Ij5OKLUb30c7N44Mr1aO5%2B5sQL&X-Amz-Signature=1bf89307fc9493923524842242e33516974e06593955c3764df256bea2343dd5&X-Amz-SignedHeaders=host&x-id=GetObject",
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
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/631425ed-b591-4bec-b53f-d5e205b969c7/images/image-0-324?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD265HMLKYL%2F20240724%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240724T101532Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIEMABjUbvClGRzInhJ%2Bjc6c4Pyb3%2FtAeGYbAr%2BJwMyy6AiEAoNXLB2N4DMI9yeO3E5ceg%2FskWmUCQrneOPLY7i4I%2BM8q8wIIo%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDOoKYt0sUAjjxJ%2Fg5CrHAv7oS6aWkFqCkMV5Jxhthd1dgxnh22SOfELwG9KsOOQCNhRWb8y54781291onYRasKNZlDJ4tjKfAYz%2FuACOFw5INuBOlGUbwh3w3Hh%2FTnb7BegsOv2J5jCd5wMAi8EK4frHZOKYy4ivK7ZTs%2FeKEaOYpD%2B1HI%2B%2FuPR8%2B9FDq983F41ONSx2qIIAa65vRbbcRluQY0q9EnUeIbDxPeNC%2Fax1PUBaaJZ1GYF4xHSo8A4gT%2B5k1tJVFlEVYyN4VfVkvt%2Bd6k4kI5SGiwRunVF3r85SggjIn1zuKQLPx6SSq%2FSwUqLnxmoO04bAM%2FhMnB4ytjDEBmq8aCV4XnEBYD4HwOAbkXcHM%2BYzDp%2Fsyivaxmg1HFEokjhEI6Z%2BzgfCFRM6lRHRWL%2Fr0GPTJ91v9wmE%2FXPWsze3cQKcSIsgHl2TeKfqmxTYonx5VjDDqIO1BjqeAWUhZL5wPexA1Is7YygQwypf6DT8gEp88wrYJ%2FjsScUkMeXT%2FKZQLsNibnIXOLAxULXEQ6yZhZi3He7Q81Eqgi%2BdNo0Tu4V%2BC1Z6fyVxwU82TpthW4NaCUjTPb6smCyjGkFqNYfxhYD%2Bk1ES3JA1p0Zp4cB0BmKzVikb%2BLeZs1mSlApo18eX%2BPg%2BPVr89e8T5dG6amKeoUEV2UU5wkx%2B&X-Amz-Signature=f4ae9ed2d4f0eb6010970bac322281b8214efd52612bae860b9547c7acc3ccfc&X-Amz-SignedHeaders=host&x-id=GetObject",
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
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/f0382ce9-3a13-4bf6-8012-22ddfbeb7c24/images/image-1-283?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD23CWZ23ER%2F20240615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240615T212046Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC4aCXVzLWVhc3QtMSJHMEUCIQD7zd9GD3IYm0HoqvXVwCpDSWXYD6HGFuC10ICVifvqkAIgOZ84neCWx5D9QGyFhc9ZHdwMPBJ5jL5zU0fg2ZCcxIgq8wIIxv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDD%2B9GYJrAJBL9dm1YCrHAtDdTrvsdbkEvJCUL6C99LMfPXn5HciFauTzh1P0bMwL2dFXksJUTR20u7UcmBZt7eQWQSc9NZLup%2FHDp3xJXJ6VS0037tAElCfOlMjFxdNFMyqxoM1bwN55L64tToHjvdYoyaBNYbktrBmIkzgnW67prpRosb85Cy2J04JRLBbu6wAR9Fp%2BEYdykTZ3GXInEpGLcNnbKk86er6%2B3KYnE1Q%2Fpx7oY1xmUhJSuLaUUrEluflj9olGDGKPtNnQm8yUKlRDJvljR%2BUBi8kghFWGh8lkAz39zPzCBs4thSuR1ZXkxZAuU8kPtKYxEV8aFZagrtTKY%2FnGhh0Am2Ft0U2AeRHMWJmUsoor8%2Blq9PO9KUmFcfofsg%2FW8NwdZgO1Fvt23f1vuMwQwqzGzde2WCMWtHsztHYwhjU8PaH38%2F2NT923XoKfbRahMDCqi7izBjqeAW8whwpT1rOERNFsk0DpKfATq9nD649jy0iwIuCJXvdTBQPmRp5mc2GwVr5%2Fca4yhfvAXnvBOSs%2F5XrOW33wvuAeeIX3PcnmSLQy4mgoIajjKCK%2BwGiR7p%2BDUlkofQEhbTlOTE%2FEN9Aq86xXO0ijgC20xgMBqX5L2c9lgAb%2Bk75Yk844%2FWDbb%2FXiIFt%2FgzXnA%2F3QexqhDDxQf6RddYDX&X-Amz-Signature=afb464bcd768357bee06002d4c8551aa4a5be670533631e61a3250290abc312c&X-Amz-SignedHeaders=host&x-id=GetObject",
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
