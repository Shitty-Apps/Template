export type Direction = 'ltr' | 'rtl';

export function setDirection(dir: Direction) {
  document.documentElement.dir = dir;
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem('app-direction', dir);
}

export function getDirection(): Direction {
  return (localStorage.getItem('app-direction') as Direction) || 'ltr';
}
