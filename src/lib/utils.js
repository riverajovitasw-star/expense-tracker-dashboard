export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter((v, i, arr) => v && arr.indexOf(v) === i)
    .join(' ');
}
