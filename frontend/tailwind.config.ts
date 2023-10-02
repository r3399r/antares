import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      orange: '#fbaf68',
      persimmon: '#f7732a',
      plum: '#7b2d17',
      coral: '#f67274',
      red: '#ec4649',
      yellow: '#f9f5e7',
      white: '#ffffff',
      brown: '#5a4045',
      gold: '#f4d979',
      honey: '#f0e5bd',
      weissbier: '#af8039',
    },
  },
  plugins: [],
};
export default config;
