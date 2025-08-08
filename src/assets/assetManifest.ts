export const imageAssets: Record<string, string> = {
  boot_logo: 'assets/logo.png',
  bg_downtown: 'assets/bg/downtown.png',
  bg_park: 'assets/bg/park.png',
  bg_shelter: 'assets/bg/shelter.png',
  bg_jobcenter: 'assets/bg/jobcenter.png',
  bg_market: 'assets/bg/market.png'
};

export const bootImages = ['boot_logo'] as const;
export const preloadImages = [
  'bg_downtown',
  'bg_park',
  'bg_shelter',
  'bg_jobcenter',
  'bg_market'
] as const;
