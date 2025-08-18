const mtConfig = require("@material-tailwind/react").mtConfig;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16a34a',
        secondary: '#0f1e17',
        border: '#14532d',
        label: '#86efac',
      },
      fontSize: {
        10: '10px',
        11: '11px',
        12: '12px',
        13: '13px',
        14: '14px',
        15: '15px',
        16: '16px',
        17: '17px',
        18: '18px',
        19: '19px',
        20: '20px',
        21: '21px',
        22: '22px',
        23: '23px',
        24: '24px',
        25: '25px',
        26: '26px',
        27: '27px',
        28: '28px',
        29: '29px',
        30: '30px',
        31: '31px',
        32: '32px',
        33: '33px',
        34: '34px',
        35: '35px',
        36: '36px',
        37: '37px',
        38: '38px',
        39: '39px',
        40: '40px',
        41: '41px',
        42: '42px',
        43: '43px',
        44: '44px',
        45: '45px',
        46: '46px',
        47: '47px',
        48: '48px',
      }
    },
  },
  plugins: [mtConfig],
}
