const hudLinks: Record<string, string> = {
  TX: 'https://www.hud.gov/',
  CA: 'https://www.hud.gov/',
  NY: 'https://www.hud.gov/',
};

export function getHUDLinkByState(state: string): string {
  return hudLinks[state] || 'https://www.hud.gov/states';
}
