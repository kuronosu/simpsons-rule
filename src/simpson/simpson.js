import { evaluate } from "mathjs";

function get_variables(a, b, n) {
  const h = (b - a) / n;
  let variables = [[1, a]];
  for (let i = 0; i < n - 1; i++) {
    let xi = h * (i + 1) + a;
    let s = i % 2 == 0 ? 4 : 2;
    variables.push([s, xi]);
  }
  variables.push([1, b]);
  return variables;
}

export default function simpson(f, a, b, n) {
  if (n % 2 != 0) {
    throw new Error("n must be an even number");
  }
  const h = (b - a) / n;
  const variables = get_variables(a, b, n);
  let sum = variables.reduce(
    (partial_sum, [s, xi]) => partial_sum + s * evaluate(f, { x: xi }),
    0
  );
  let i = (h * sum) / 3;
  return [i.toFixed(4), variables];
}
