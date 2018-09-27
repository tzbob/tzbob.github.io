let decimals = value => {
  let splits = value.toString().split(".");
  if (value === undefined || Number.isNaN(value) || splits.length === 1) return 0;
  return splits[1].length;
}

let stockVolume = (totalVolume, dilutedConcentration, stockConcentration) => {
  let dilution = stockConcentration * 1.0 / dilutedConcentration;
  if (dilution === 0 || dilutedConcentration === 0) return 0;
  return totalVolume * 1.0 / dilution;
}

let range = l => Array.from({
  length: l
}, (x, i) => i);

document.body.onload = () => {

  let totalVolumeMaxEl = document.getElementById("totalVolumeMax");
  let dilutedConcentrationEl = document.getElementById("dilutedConcentration");
  let stockConcentrationEl = document.getElementById("stockConcentration");
  let decimalsEl = document.getElementById("decimals");
  let resultsEl = document.getElementById("results");

  [totalVolumeMaxEl, dilutedConcentrationEl, stockConcentrationEl, decimalsEl].forEach(
    el => {
      el.oninput = ev => {
        let maxElVal = totalVolumeMaxEl.value
        let max = (maxElVal !== "") ? maxElVal : 2000;

        let decimalsElVal = decimalsEl.value
        let decimalsCount = (decimalsElVal !== "") ? decimalsElVal : 0;

        let volumes = range(max).map(tv => {
          let sv = stockVolume(tv, dilutedConcentrationEl.value, stockConcentrationEl.value);
          return [tv, sv];
        });

        let filteredVolumes = volumes.filter(v => {
          return decimals(v[1]) <= decimalsCount;
        });

        let listItems = filteredVolumes.map(v => {
          let li = document.createElement('li');
          li.appendChild(document.createTextNode(v[1] + " mL from stock gives total volume of " + v[0] + " mL"));
          return li;
        })

        while (resultsEl.firstChild) {
          resultsEl.removeChild(resultsEl.firstChild);
        }

        listItems.forEach(li => resultsEl.appendChild(li));
      };
    });
};
