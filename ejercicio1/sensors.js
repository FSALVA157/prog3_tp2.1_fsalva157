class Sensor {
  static type_permitidos = ["temperature", "humidity", "pressure"];

  constructor(id, name, type, value, unit, updated_at) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.value = value;
    this.unit = unit;
    this.updated_at = updated_at;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    // let id_string = id.toString();
    // if (typeof id_string !== "string") {
    //   throw new Error("El ID debe ser una cadena de texto");
    // }
    this._id = id;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    if (typeof name !== "string") {
      throw new Error("El nombre debe ser una cadena de texto");
      this._name = name;
    }
  }

  get type() {
    return this._type;
  }

  set type(type) {
    if (typeof type !== "string" || !Sensor.type_permitidos.includes(type)) {
      throw new Error(
        "El tipo debe ser una cadena de texto y debe ser uno de los tipos permitidos(temperature, humidity o pressure)"
      );
    }
    this._type = type;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (typeof value !== "number") {
      throw new Error("El valor debe ser un número decimal");
    }
    this._value = value;
  }

  get unit() {
    return this._unit;
  }

  set unit(unit) {
    if (typeof unit !== "string") {
      throw new Error("La unidad debe ser un texto");
    }
    this._unit = unit;
  }

  get updated_at() {
    return this._updated_at;
  }

  set updated_at(updated_at) {
    let tipo = typeof updated_at;    
    if (tipo !== "string" && !(updated_at instanceof Date)) {
      throw new Error("La fecha debe ser una cadena de texto o una fecha");
    }
    this._updated_at = updated_at;
  }

  set updateValue(value) {
    const value_aux = parseFloat(value);
    if (typeof value_aux === 'number'){
      this.value = value_aux;      
      this.updated_at = new Date();
    } else {
      throw new Error(
        "El valor debe ser un número decimal"
      );
    }
  }
}

class SensorManager {
  constructor() {
    this.sensors = [];
  }

  addSensor(sensor) {
    this.sensors.push(sensor);
  }

  updateSensor(id) {
    const sensor = this.sensors.find((sensor) => sensor.id === id);
    if (sensor) {
      let newValue;
      switch (sensor.type) {
        case "temperatura": // Rango de -30 a 50 grados Celsius
          newValue = (Math.random() * 80 - 30).toFixed(2);
          break;
        case "humedad": // Rango de 0 a 100%
          newValue = (Math.random() * 100).toFixed(2);
          break;
        case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
          newValue = (Math.random() * 80 + 960).toFixed(2);
          break;
        default: // Valor por defecto si el tipo es desconocido
          newValue = (Math.random() * 100).toFixed(2);
      }
      sensor.updateValue = newValue;
      this.render();
    } else {
      console.error(`Sensor ID ${id} no encontrado`);
    }
  }

  async loadSensors(url) {
    const response = await fetch(url);
    const data = await response.json();
    data.forEach((sensor) => {
      const newSensor = new Sensor(
        sensor.id,
        sensor.name,
        sensor.type,
        sensor.value,
        sensor.unit,
        sensor.updated_at
      );
      this.addSensor(newSensor);
    });
    console.log(this.sensors);
  }

  render() {
    const container = document.getElementById("sensor-container");
    container.innerHTML = "";
    this.sensors.forEach((sensor) => {
      const sensorCard = document.createElement("div");
      sensorCard.className = "column is-one-third";
      sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                              sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                          sensor.id
                        }">Actualizar</a>
                    </footer>
                </div>
            `;
      container.appendChild(sensorCard);
    });

    const updateButtons = document.querySelectorAll(".update-button");
    updateButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const sensorId = parseInt(button.getAttribute("data-id"));
        this.updateSensor(sensorId);
      });
    });
  }
}

const monitor = new SensorManager();

monitor.loadSensors("sensors.json").then(() => {
  monitor.render();
});

