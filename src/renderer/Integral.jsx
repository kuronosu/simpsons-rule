import { parse } from "mathjs";
import React, { useEffect, useState } from "react";

function saveParse(val, fun) {
  try {
    let v = fun(val);
    if (v) {
      return v;
    }
    console.log(v)
    return val;
  } catch (error) {
    return val;
  }
}

function useInput({ type, defaultValue, className = "", parse = null }) {
  const [value, setValue] = useState(defaultValue);
  const input = (
    <input
      value={value}
      onChange={(e) =>
        parse == null
          ? setValue(e.target.value)
          : setValue(saveParse(e.target.value, parse))
      }
      type={type}
      className={className}
    />
  );
  return [value, input];
}

function validEcuation(ecuation) {
  ecuation = ecuation.trim()
  try {
    if (ecuation.length == 0) return [false, "Empty function"];
    parse(ecuation);
    return [true, null];
  } catch (error) {
    return [false, error.message];
  }
}

function valid(f, a, b, n) {
  const [ok, err] = validEcuation(f);
  if (!ok) {
    return err;
  }
  if (n % 2 != 0) {
    return "n must be even";
  }
  if (isNaN(a) || a.length == 0) {
    return "Invalid a";
  }
  if (isNaN(b) || b.length == 0) {
    return "Invalid b";
  }
  if (isNaN(n) || n.length == 0) {
    return "Invalid n";
  }
  if (b <= a) {
    return "b must be greater than a";
  }
  if (n > 101) {
    return "n must be less than or equal to 100";
  }
  if (n < 2) {
    return "n must be greater than or equal to 2";
  }
  return null;
}

export function Integral({ da, db, df, onChange, onCalculate, onError }) {
  const [disabled, setDisabled] = useState(false);
  const [a, aInput] = useInput({
    type: "number",
    defaultValue: da,
    className: "number-input",
    parse: parseFloat,
  });
  const [b, bInput] = useInput({
    type: "number",
    defaultValue: db,
    className: "number-input",
    parse: parseFloat,
  });
  const [f, fInput] = useInput({
    type: "text",
    defaultValue: df,
    parse: (v) => v.replaceAll("**", "^"),
  });
  const [n, nInput] = useInput({
    type: "number",
    defaultValue: 10,
    className: "number-input",
    parse: parseInt,
  });

  useEffect(() => {
    let err = valid(f, a, b, n);
    if (err != null) {
      setDisabled(true);
      onError(err);
    } else {
      setDisabled(false);
      onChange({ a, b, f, n });
    }
  }, [a, b, f, n]);

  return (
    <div className="integral">
      <div className="numbers-container">
        <label>a={aInput}</label>
        <label>b={bInput}</label>
        <label>n={nInput}</label>
      </div>
      <label className="f">f(x)={fInput}dx</label>
      <input
        type="submit"
        value="Calcular"
        onClick={() => onCalculate(f, a, b, n)}
        disabled={disabled}
      />
    </div>
  );
}
