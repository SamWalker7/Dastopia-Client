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
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/9bac7026-70ed-4019-81f2-54218b410363/images/image-0-299?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD2XD4M3FEI%2F20240615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240615T212046Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC4aCXVzLWVhc3QtMSJHMEUCIGFTpZUJhXvzHBO44hNmstZd91%2FfalaF6PM50r8DBGX4AiEAshqCu0PkjM15o%2FCBV8i2o10quP2t7KAVNx6x7IGGVoQq8wIIxv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDA%2FqmoOJQ41nx1RmyCrHAulf0HeLCrL0F0Cdb7TjCScml%2B2S3%2ByGwCj2z3y8uaTP1mYtyzvGr9bhBVqKDHxfSOYcqjxKJ29Zj1oAQZnr5ZkzaIpHoRRL5TvGeZWPnW9B3dgwTQeceGZIFTSmsoWVv%2FEgIxvKQNulgk5CWQVsqPRDXEiblbKTXL%2BvwP4Ux3cSo1vkzXmOk1sBN2c%2FeEXoFXh2QuuJR%2B46aqIAluX6tQramJZjfMo22vHsvtZupRapYvkVJFnRSoXgeyELpN2wNieWTEvosq91lSlK3C6fejEiIMoyJ1XoZqwOup47aHFs9P51PaNRXjqSt5dZcYJxa5tfM8dS2MVP8ljJQb2vCWmdVu7MTOxqPyzI4riDMLgkFH3Mye0Xn3VroiPN%2FQcAjAAWf6%2Fzm0zeB5dXcJIzaHYMO3uDXU2hAAPQYFUjQhaTgDKloPMZHDDVhrizBjqeASzi3OnvX1SarllHSz8xhmA4lxReuD0Hhc6O2YpBDfHUAvofKTGVX4kipd%2Bg1s4m3rceGs4ieCH1oqLtJcXFTrxyX5aC9lEmuRJA2Xk8Wh3WzMeTxUy3nf2R3yuZJ5RlDu5%2Fzf7%2FIO5y2kYGAIU4B4LJsiO4htbDzqu3sOlCr4I2jh9cz1JWRvz%2FLNpnxjWtl8kndstNcacAZmT8Y2AK&X-Amz-Signature=a0f1b4925adafd9cd33eff3bb3a69aaee5786c3354a0502b1a019c3fac26c078&X-Amz-SignedHeaders=host&x-id=GetObject",
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
      img: "https://dastopia-cars.s3.us-east-1.amazonaws.com/f24807cc-f407-4344-a0b0-d51c2904a227/images/image-0-10?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA5FTZBAD23CWZ23ER%2F20240615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240615T212049Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC4aCXVzLWVhc3QtMSJHMEUCIQD7zd9GD3IYm0HoqvXVwCpDSWXYD6HGFuC10ICVifvqkAIgOZ84neCWx5D9QGyFhc9ZHdwMPBJ5jL5zU0fg2ZCcxIgq8wIIxv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MDU0MTgxNzg4MDUiDD%2B9GYJrAJBL9dm1YCrHAtDdTrvsdbkEvJCUL6C99LMfPXn5HciFauTzh1P0bMwL2dFXksJUTR20u7UcmBZt7eQWQSc9NZLup%2FHDp3xJXJ6VS0037tAElCfOlMjFxdNFMyqxoM1bwN55L64tToHjvdYoyaBNYbktrBmIkzgnW67prpRosb85Cy2J04JRLBbu6wAR9Fp%2BEYdykTZ3GXInEpGLcNnbKk86er6%2B3KYnE1Q%2Fpx7oY1xmUhJSuLaUUrEluflj9olGDGKPtNnQm8yUKlRDJvljR%2BUBi8kghFWGh8lkAz39zPzCBs4thSuR1ZXkxZAuU8kPtKYxEV8aFZagrtTKY%2FnGhh0Am2Ft0U2AeRHMWJmUsoor8%2Blq9PO9KUmFcfofsg%2FW8NwdZgO1Fvt23f1vuMwQwqzGzde2WCMWtHsztHYwhjU8PaH38%2F2NT923XoKfbRahMDCqi7izBjqeAW8whwpT1rOERNFsk0DpKfATq9nD649jy0iwIuCJXvdTBQPmRp5mc2GwVr5%2Fca4yhfvAXnvBOSs%2F5XrOW33wvuAeeIX3PcnmSLQy4mgoIajjKCK%2BwGiR7p%2BDUlkofQEhbTlOTE%2FEN9Aq86xXO0ijgC20xgMBqX5L2c9lgAb%2Bk75Yk844%2FWDbb%2FXiIFt%2FgzXnA%2F3QexqhDDxQf6RddYDX&X-Amz-Signature=00dedf97c150348bb0777cf319642107271cbd7a31be9575bec180154ccd9df4&X-Amz-SignedHeaders=host&x-id=GetObject",
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
