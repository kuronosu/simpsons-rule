import React, { useState } from "react";
import Plot from "react-plotly.js";
import { MathComponent } from "mathjax-react";
import { parse, range, compile, evaluate } from "mathjs";

import { Integral } from "./Integral";
import simpson from "../simpson/simpson";

function drawValues(expression, a, b, h) {
  const expr = compile(expression);
  const xValues = range(a, b + h, h).toArray();
  const yValues = xValues.map((x) => expr.evaluate({ x: x }));
  let plots = [
    {
      x: xValues,
      y: yValues,
      type: "scatter",
      showlegend: false,
      fill: "tozeroy",
    },
  ];
  for (let index = 0; index < xValues.length; index++) {
    const x = xValues[index];
    const y = yValues[index];
    plots.push({
      x: [x, x],
      y: [0, y],
      mode: "lines",
      showlegend: false,
      marker: {
        color: "rgb(219, 64, 82)",
        size: 12,
      },
    });
  }
  return plots;
}

export function App() {
  const [func, setFunc] = useState("");
  const [err, setError] = useState(null);
  const [ecuation, setEcuation] = useState(null);
  const [ecuation2, setEcuation2] = useState(null);
  const [sol, setSol] = useState(null);
  const [plot, setPlot] = useState(null);

  const onChange = ({ a, b, f, n }) => {
    setEcuation(null);
    setSol(null);
    setPlot(null);
    try {
      setFunc(String.raw`\int_{${a}}^{${b}} ${parse(f).toTex()}\ dx`);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const onCalculate = (f, a, b, n) => {
    try {
      const [value, variables] = simpson(f, a, b, n);
      let ecuation = String.raw`\int_{${a}}^{${b}} ${parse(f).toTex()}\ dx`;
      let tmp = [];
      variables.forEach(([s, xi]) => {
        xi = xi.toFixed(5);
        let _f = `${s}*${f}`.replaceAll("x", xi);
        let _v = evaluate(`${s}*${f}`, { x: xi, s });
        tmp.push([_f, _v]);
      });
      const h = (b - a) / n;
      let tmp1 = `${h}/3*(${tmp.map((it) => it[0]).join("+")})`;
      // tmp = String.raw`$$\displaylines{${h}/3*(${tmp.map(it => it[0]).join("+")})\\${tmp.map(it => it[0]).join("+")}}$$`;
      let tmp2 = `${h}/3*(${tmp.map((it) => it[1]).join("+")})`;

      setFunc(`${ecuation}`);
      setEcuation(`≈${parse(tmp1).toTex()}`);
      setEcuation2(`≈${parse(tmp2).toTex()}`);
      setSol(`≈${value}`);
      setPlot({
        data: drawValues(f, a, b, h),
        layout: {
          xaxis: {
            range: [a - h, b + h],
          },
        },
      });
    } catch (error) {
      console.error(error.stack);
      setError(error.message);
    }
  };

  return (
    <div className="padding">
      <div className="container-1">
        <Integral
          da={0}
          db={1}
          df={"e^x^2"}
          onChange={onChange}
          onCalculate={onCalculate}
          onError={(err) => {
            setSol(null);
            setPlot(null);
            setEcuation(null);
            setError(err);
          }}
        />
        <div>
          {err == null && (
            <MathComponent
              tex={func}
              onError={(msg) => {
                setError(msg);
              }}
              onSuccess={() => setError(null)}
            />
          )}
          {err != null && <p>{err}</p>}
        </div>
      </div>
      <div className="sol">
        <div className="MathComponent">
          {ecuation != null && (
            <MathComponent
              tex={ecuation}
              onError={(msg) => setError(msg)}
              onSuccess={() => setError(null)}
            />
          )}
        </div>
        <div className="MathComponent">
          {ecuation2 != null && (
            <MathComponent
              tex={ecuation2}
              onError={(msg) => setError(msg)}
              onSuccess={() => setError(null)}
            />
          )}
        </div>
        {sol != null && (
          <MathComponent
            tex={sol}
            onSuccess={() => setError(null)}
            onError={(msg) => {
              setError(msg);
            }}
          />
        )}
      </div>
      {plot && (
        <Plot
          data={plot.data}
          layout={plot.layout}
          config={{ staticPlot: true }}
          useResizeHandler={true}
        />
      )}
    </div>
  );
}
