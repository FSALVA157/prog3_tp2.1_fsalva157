class Currency {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}

class CurrencyConverter {
  constructor() {
    this.apiUrl = "api.frankfurter.app";
    this.currencies = [];
    this.tablaDiferencias = [];
  }

  async getCurrencies() {
    const response = await fetch(`https://${this.apiUrl}/currencies`);
    const data = await response.json();
    //console.log(data);
    Object.keys(data).map((key) => {
      //console.log(`${key}: ${data[key]}`);
      this.currencies.push(new Currency(key, data[key]));
    });
    //console.log(this.currencies);
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency.code === toCurrency.code) {
      return amount;
    }
    try {
      const response = await fetch(
        `https://${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`
      );
      const data = await response.json();

      return data.rates[toCurrency.code];
    } catch (error) {
      return null;
    }
  }

  //metodo que convierte la fecha al formato yyyy-mm-dd
  getFecha(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  }

  async getDifferenceYesterday() {
    try {
      let aux = new Date();
      const today = this.getFecha(aux);
      aux.setDate(aux.getDate() - 1);
      const yesterday = this.getFecha(aux);
      console.log(today, yesterday);

      const resYesterday = await fetch(`https://${this.apiUrl}/${yesterday}`);
      //const resYesterday = await fetch(`https://${this.apiUrl}/2024-06-03`);
      const yesterdayValue = await resYesterday.json();

      const resToday = await fetch(`https://${this.apiUrl}/${today}`);
      //const resToday = await fetch(`https://${this.apiUrl}/2024-06-04`);
      const todayValue = await resToday.json();
      console.log("------Valores de ayer y hoy--------");
      console.log(yesterdayValue);
      console.log(todayValue);
      Object.keys(yesterdayValue.rates).forEach((cur) => {
        const current = cur;
        const value_yesterday = yesterdayValue.rates[cur];
        const value_today = todayValue.rates[cur];
        const difference = value_today - value_yesterday;
        this.tablaDiferencias.push({
          currency: current,
          value_today: value_today,
          value_yesterday: value_yesterday,
          difference: difference,
        });
      });

      //console.log(this.tablaDiferencias);
    } catch (error) {}
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("conversion-form");
  const resultDiv = document.getElementById("result");
  const fromCurrencySelect = document.getElementById("from-currency");
  const toCurrencySelect = document.getElementById("to-currency");
  const tableBody = document.getElementById("tableBody");

  const converter = new CurrencyConverter("https://api.frankfurter.app");

  await converter.getCurrencies();
  await converter.getDifferenceYesterday();
  console.log(converter.tablaDiferencias);
  populateTable(tableBody, converter.tablaDiferencias);
  populateCurrencies(fromCurrencySelect, converter.currencies);
  populateCurrencies(toCurrencySelect, converter.currencies);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const fromCurrency = converter.currencies.find(
      (currency) => currency.code === fromCurrencySelect.value
    );
    const toCurrency = converter.currencies.find(
      (currency) => currency.code === toCurrencySelect.value
    );

    const convertedAmount = await converter.convertCurrency(
      amount,
      fromCurrency,
      toCurrency
    );

    if (convertedAmount !== null && !isNaN(convertedAmount)) {
      resultDiv.textContent = `${amount} ${
        fromCurrency.code
      } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
    } else {
      resultDiv.textContent = "Error al realizar la conversión.";
    }
  });

  function populateCurrencies(selectElement, currencies) {
    if (currencies) {
      currencies.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency.code;
        option.textContent = `${currency.code} - ${currency.name}`;
        selectElement.appendChild(option);
      });
    }
  }

  

  function populateTable(table, data) {
    if (data) {
      data.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `            
            <td>${item.currency}</td>
            <td>${item.value_today}</td>
            <td>${item.value_yesterday}</td>
            <td>${item.difference}</td>            
        `;

        table.appendChild(row);
      });
    }
  }
});
