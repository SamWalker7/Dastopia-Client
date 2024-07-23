import Golf6 from "../images/cars-big/golf6.jpg";
import AudiA1 from "../images/cars-big/audia1.jpg";
import Toyota from "../images/cars-big/toyotacamry.jpg";
import Bmw320 from "../images/cars-big/bmw320.jpg";
import Benz from "../images/cars-big/benz.jpg";
import Passat from "../images/cars-big/passatcc.jpg";

export const CAR_DATA = [
  [
    {
      name: "Toyota Yaris",
      price: "2,500",
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/ddd0a40f-894a-45ee-b854-900ddc94b93d/images/image-0-551?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD2YBICGYUP%2F20240723%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240723T112724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQCBZlZMXQ%2BLwEmNtY6NNUvsM2Bb5%2BE1OwB5BZVm6NNGewIgAVooqzfmCzsu7F7foST8K4Tx4tOwRykMQYcUMgwIB5wq8wIIjf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDKFr0Lz3C0GVOgv0vCrHAvlpbFss7%2F5A%2FXoKz4MpyJnTipB05meV2tu6HA%2FagMOOXMMK7yu7jNjpWD9jSHEUO4yknLHRjIgB3XiiCVt8TMp8Mc95rrROPZF0vbYqemcgAd5DkSRjfBlrztzBbrXxDbOsoJRrpm7PXKC2ci8d1E8AAprGWgvz5TXSsB65hoHc6%2Bas6l8hRhcdtXcz%2FGOkdBc9DyXD%2BluG0zILip8Z3f%2FFzevv0FaisixM8V8eVJqxgmxdQHk3ht9aJuDwXHxp0O49RPbpA6g3zsigrs55UD%2BG1rci0FarU52QcDoB3v518nBKRg3%2F4UveXxMarhlrglDLU0GRcV%2FDI4bKpcRtHZCZm2x0XupxEM7R8DjODXDrzuvPqTQf7pyfv73s7UGX7qnsxKhZXcx7GE8dBREs0BG%2F0X5j7Z%2BtrUPSgBoGxAW%2BBNpATOIr4TCbp%2F60BjqeAbE8JIsYDUSPHAyQIghtCJvbF82FsaY8l%2F8InV5vb%2F9rwotw%2B3%2FOvlnCft9p%2BM1hEjuiUaYk9cT9LVpGDQiu4bCCSvdhLGiIfTDOFlG4TDEzJmVdAGLT2VBp5LqRhihII6mUyOnE6wxRikp%2F0Fd5tjxvDGgGRzIZtgVSTGgJdfyOta4yoH0DB4rIoz9Ej0jHCqZtyuaj%2FYhTtEN4NWPn&X-Amz-Signature=bdd83e6dcca216c78b5cd57d4c9d85315bf84c47bb8d32c6c00e422b17fcb7a1&X-Amz-SignedHeaders=host&x-id=GetObject",
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
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/576258b6-c83b-48fa-9ee5-e18488734606/images/image-0-480?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD22DIJUZKI%2F20240723%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240723T112724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIEgWYtDq7JFjgcSveQmOt4GPHebr1weCAqHvH6pIAIVwAiEAizatHdk2l2dZjJyLoeGnPe5DllHuYUpk6nC%2FNI3nxMEq8wIIjf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDHSloevr2zAf%2B0KcjirHAum6yo8GwFjFIjzqW0wTsar7N4Ai9039yTROB6RxhZU7vbPeKQsCK8yX669YjmnbXwBgfoG%2BBMDBF4X05MxQGXpk0X0XHSTNUjfosXpKCrZkaf4QTRpKQtb7wMbqQb2wx0sDyo6IAz8%2Bxuxh%2FOUC2%2BWObIB6IZEiROkT9dayBIrocyXDMuAWYIwFW1BTils9ErQlNLl8WuvGu8ygpyR5039GguihXLnqaQ6yN4wlgA1Gb4QG%2BjdRMYuNsLJmmGkjUip3skXER5tg33Bss9OzTUeEE91xgqIWbG74bBxAdySOBvFEXUMhevjqx%2FaK2PumdYSg6avpHcb5iTIO4FJBQtWGauYtwzi8Zn3lpN%2Bag1h8Yc3sCEl36DAUWUxV1H5ktycYMJGQFqrEaMPceL1%2BHTnPIK%2FOlzW1JaR%2FOuJDKLKDs2IB1FyIDTCbp%2F60BjqeAQvYCpfLH%2BXx6K3t5rs1dWGAyENxmJLy5KYyySXuTuTwtrhNggGQpHC8tuPFspxUUuPt3wVvn0CTxFRwnreYc09MQmqyrqryrPp3AVQwwCgYbVWcgpqeY7OuVU5grzq70jvOWkHCbZJqlJNkQLQ0k6N1OQElT4w9i3PjA0Bcaz33C0R0ovJI1Hm4lAA850sSA7yFWUYJVziR8gP%2BOV1v&X-Amz-Signature=77923c20562a67f894b33e33d10334eb47793f6e7b174f974248393abe3edd39&X-Amz-SignedHeaders=host&x-id=GetObject"
,
      model: "Swift",
      mark: "Suzuki",
      year: "2021",
      doors: "4/5",
      air: "Yes",
      transmission: "Automatic",
      fuel: "Gasoline",
    },
  ],
  [
    {
      name: "Chang Alsvin",
      price: "3,500",
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/156992f3-f33c-446f-9725-91f7734a9940/images/image-1-947?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD23CWZ23ER%2F20240615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240615T212049Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC4aCXVzLWVhc3QtMSJHMEUCIQD7zd9GD3IYm0HoqvXVwCpDSWXYD6HGFuC10ICVifvqkAIgOZ84neCWx5D9QGyFhc9ZHdwMPBJ5jL5zU0fg2ZCcxIgq8wIIxv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDD%2B9GYJrAJBL9dm1YCrHAtDdTrvsdbkEvJCUL6C99LMfPXn5HciFauTzh1P0bMwL2dFXksJUTR20u7UcmBZt7eQWQSc9NZLup%2FHDp3xJXJ6VS0037tAElCfOlMjFxdNFMyqxoM1bwN55L64tToHjvdYoyaBNYbktrBmIkzgnW67prpRosb85Cy2J04JRLBbu6wAR9Fp%2BEYdykTZ3GXInEpGLcNnbKk86er6%2B3KYnE1Q%2Fpx7oY1xmUhJSuLaUUrEluflj9olGDGKPtNnQm8yUKlRDJvljR%2BUBi8kghFWGh8lkAz39zPzCBs4thSuR1ZXkxZAuU8kPtKYxEV8aFZagrtTKY%2FnGhh0Am2Ft0U2AeRHMWJmUsoor8%2Blq9PO9KUmFcfofsg%2FW8NwdZgO1Fvt23f1vuMwQwqzGzde2WCMWtHsztHYwhjU8PaH38%2F2NT923XoKfbRahMDCqi7izBjqeAW8whwpT1rOERNFsk0DpKfATq9nD649jy0iwIuCJXvdTBQPmRp5mc2GwVr5%2Fca4yhfvAXnvBOSs%2F5XrOW33wvuAeeIX3PcnmSLQy4mgoIajjKCK%2BwGiR7p%2BDUlkofQEhbTlOTE%2FEN9Aq86xXO0ijgC20xgMBqX5L2c9lgAb%2Bk75Yk844%2FWDbb%2FXiIFt%2FgzXnA%2F3QexqhDDxQf6RddYDX&X-Amz-Signature=4a5420398c840d927a5d315f398f44886d14c63005d19c41080f7fca8d474a34&X-Amz-SignedHeaders=host&x-id=GetObject",
      model: "Alsvin",
      mark: "Chang",
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
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/c53f065a-c0c7-4fba-9473-098a26a98c3a/images/image-0-211?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD2SFMQBFHE%2F20240615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240615T212051Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC4aCXVzLWVhc3QtMSJHMEUCIQCJ4QPAPswaKa2XbNsyehyeRLgL%2Fkzxzhqt03UY5PIgmAIgdGfhJPXV9GqVmZbCdLqGaI8ss2JGz%2FwvQaTWGG2RrEIq8wIIxv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDNKP%2FxOeRfeFQ6bWYirHAvTsLlxUFh%2F9bm%2Fx5NGxca6u%2FE9Nla4AeeD%2Fppbucxzm6o06LGyVpsaDRTQGiv6NrbhrsmLiBw4TrQxnc%2Bj5OHIJGNCPH8bKy2LbDsbKjWILOdp%2Bns0Ykn9%2B59VmrauC424uoNmNtNVlcTGuEqeXAE4FRUIYd5ookmJyVQRIdhTim76HsyL2BFX%2BIFLsMUoLue8VQHtiNkIylvKbM0SxMKlgPAjAXNpKk%2BQOosBdA2HiFCNeNdJ7n1LICEwW0apY8XNTLaMYGbXZxNoTxhdXeU013oNoFLF1z7fzLslZEkvK2Lwv%2BCngAilZPmCBBvbPjoGAkImYnXag1nhFnren8Xc6dff4qBw80t7Ctc1RedPR5UavWvkyuTMJ3FnslYGKMAk5%2FwzAiP%2F8fAEkYRdw0XtRAcQA7QhEiHcRI9ZxjvUg7rsoQq8hrjDRhrizBjqeAbsvakGR%2FLJ8XsN0hUjkW4OadQJhkvC%2FLUoqnlwc0Gy6h98sLFhsKfBCMxRYgWI91KFafldDr98%2FAodH7Wwzbq5Bb7G%2FBzIuIQv45ygZbzlWNdlOYOaCGAX4cAV%2FjU2De0UaqESuLiHFmUG8MDh9FgULSqQlK4AWvHb8n%2Fh%2FZT3ZzZwTzYt%2FjphyQdVB99V5K0NCZJVvuAnlVrnMRUhT&X-Amz-Signature=98fb7614e0bf1ea632762c2ca2a6fb00bbfda43b302b28b2f2fd79d5c502eb41&X-Amz-SignedHeaders=host&x-id=GetObject",
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
      name: "Toyoya Corolla",
      price: "2,500",
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/821ba15a-8c6c-42ad-9f7e-54e91d56f4ec/images/image-2-649?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD23CWZ23ER%2F20240615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240615T212045Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC4aCXVzLWVhc3QtMSJHMEUCIQD7zd9GD3IYm0HoqvXVwCpDSWXYD6HGFuC10ICVifvqkAIgOZ84neCWx5D9QGyFhc9ZHdwMPBJ5jL5zU0fg2ZCcxIgq8wIIxv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDD%2B9GYJrAJBL9dm1YCrHAtDdTrvsdbkEvJCUL6C99LMfPXn5HciFauTzh1P0bMwL2dFXksJUTR20u7UcmBZt7eQWQSc9NZLup%2FHDp3xJXJ6VS0037tAElCfOlMjFxdNFMyqxoM1bwN55L64tToHjvdYoyaBNYbktrBmIkzgnW67prpRosb85Cy2J04JRLBbu6wAR9Fp%2BEYdykTZ3GXInEpGLcNnbKk86er6%2B3KYnE1Q%2Fpx7oY1xmUhJSuLaUUrEluflj9olGDGKPtNnQm8yUKlRDJvljR%2BUBi8kghFWGh8lkAz39zPzCBs4thSuR1ZXkxZAuU8kPtKYxEV8aFZagrtTKY%2FnGhh0Am2Ft0U2AeRHMWJmUsoor8%2Blq9PO9KUmFcfofsg%2FW8NwdZgO1Fvt23f1vuMwQwqzGzde2WCMWtHsztHYwhjU8PaH38%2F2NT923XoKfbRahMDCqi7izBjqeAW8whwpT1rOERNFsk0DpKfATq9nD649jy0iwIuCJXvdTBQPmRp5mc2GwVr5%2Fca4yhfvAXnvBOSs%2F5XrOW33wvuAeeIX3PcnmSLQy4mgoIajjKCK%2BwGiR7p%2BDUlkofQEhbTlOTE%2FEN9Aq86xXO0ijgC20xgMBqX5L2c9lgAb%2Bk75Yk844%2FWDbb%2FXiIFt%2FgzXnA%2F3QexqhDDxQf6RddYDX&X-Amz-Signature=897abe3f8bb50cd3d240f7e9bb498d212ff15f1bc28541c016d80a3cee37e14d&X-Amz-SignedHeaders=host&x-id=GetObject",
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
